from rest_framework import generics, permissions, status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import Car, CarImage, Favorite
from .serializers import (
    RegisterSerializer,
    CarSerializer,
    FavoriteSerializer,
)


class RegisterView(generics.CreateAPIView):

    serializer_class = RegisterSerializer


class CarListCreateView(generics.ListCreateAPIView):

    queryset = Car.objects.all().order_by("-created_at")

    serializer_class = CarSerializer

    def get_permissions(self):

        if self.request.method == "GET":
            return [permissions.AllowAny()]

        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):

        serializer.save(
            seller=self.request.user
        )


class IsCarOwner(permissions.BasePermission):

    def has_object_permission(
        self,
        request,
        view,
        obj
    ):

        if request.method in permissions.SAFE_METHODS:
            return True

        return obj.seller == request.user


class CarDetailView(
    generics.RetrieveUpdateDestroyAPIView
):

    queryset = Car.objects.all()

    serializer_class = CarSerializer

    permission_classes = [
        IsCarOwner
    ]


class CarImageUploadView(generics.CreateAPIView):

    queryset = CarImage.objects.all()

    parser_classes = [
        MultiPartParser,
        FormParser
    ]

    permission_classes = [
        permissions.IsAuthenticated
    ]

    def post(
        self,
        request,
        *args,
        **kwargs
    ):

        car_id = request.data.get("car")

        if not car_id:

            return Response(
                {
                    "error": "Car ID is required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:

            car = Car.objects.get(
                id=car_id
            )

        except Car.DoesNotExist:

            return Response(
                {
                    "error": "Car not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        if car.seller != request.user:

            return Response(
                {
                    "error": (
                        "You can only upload images "
                        "for your own car."
                    )
                },
                status=status.HTTP_403_FORBIDDEN
            )

        image = request.FILES.get("image")

        if not image:

            return Response(
                {
                    "error": "Image is required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        is_primary = request.data.get(
            "is_primary",
            False
        )

        car_image = CarImage.objects.create(
            car=car,
            image=image,
            is_primary=str(
                is_primary
            ).lower() == "true"

        )
        return Response(
            {
                "id": car_image.id,

                "image": request.build_absolute_uri(
                    car_image.image.url
                ),

                "is_primary": car_image.is_primary
            },

            status=status.HTTP_201_CREATED
        )
    


class FavoriteListCreateView(
    generics.ListCreateAPIView
):

    serializer_class = FavoriteSerializer

    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_queryset(self):

        return Favorite.objects.filter(
            user=self.request.user
        ).select_related(
            "car"
        ).prefetch_related(
            "car__images"
        ).order_by(
            "-created_at"
        )

    def create(
        self,
        request,
        *args,
        **kwargs
    ):

        car_id = request.data.get("car")

        if not car_id:
            return Response(
                {
                    "error": "Car ID is required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:

            car = Car.objects.get(
                id=car_id
            )

        except Car.DoesNotExist:

            return Response(
                {
                    "error": "Car not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        favorite, created = Favorite.objects.get_or_create(
            user=request.user,
            car=car
        )

        serializer = self.get_serializer(
            favorite
        )

        return Response(
            serializer.data,
            status=(
                status.HTTP_201_CREATED
                if created
                else status.HTTP_200_OK
            )
        )


class FavoriteDeleteView(
    generics.DestroyAPIView
):

    permission_classes = [
        permissions.IsAuthenticated
    ]

    def delete(
        self,
        request,
        *args,
        **kwargs
    ):

        car_id = kwargs.get("car_id")

        favorite = Favorite.objects.filter(
            user=request.user,
            car_id=car_id
        ).first()

        if not favorite:

            return Response(
                {
                    "error": "Favorite not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        favorite.delete()

        return Response(
            status=status.HTTP_204_NO_CONTENT
        )


class MyCarsView(
    generics.ListAPIView
):

    serializer_class = CarSerializer

    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_queryset(self):

        return Car.objects.filter(
            seller=self.request.user
        ).prefetch_related(
            "images"
        ).order_by(
            "-created_at"
        )


class CurrentUserView(
    generics.RetrieveAPIView
):

    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get(self, request, *args, **kwargs):

        return Response({
            "id": request.user.id,
            "username": request.user.username,
            "email": request.user.email,
            "first_name": request.user.first_name,
            "last_name": request.user.last_name,
        })


class CarImageDeleteView(
    generics.DestroyAPIView
):

    queryset = CarImage.objects.all()

    permission_classes = [
        permissions.IsAuthenticated
    ]

    def delete(
        self,
        request,
        *args,
        **kwargs
    ):

        image_id = kwargs.get("pk")

        try:

            car_image = CarImage.objects.select_related(
                "car"
            ).get(
                id=image_id
            )

        except CarImage.DoesNotExist:

            return Response(
                {
                    "error": "Image not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )


        if car_image.car.seller != request.user:

            return Response(
                {
                    "error": (
                        "You can only delete "
                        "images from your own car."
                    )
                },
                status=status.HTTP_403_FORBIDDEN
            )


        car_image.delete()


        return Response(
            status=status.HTTP_204_NO_CONTENT
        )


class CarImagePrimaryView(
    generics.UpdateAPIView
):

    queryset = CarImage.objects.all()

    permission_classes = [
        permissions.IsAuthenticated
    ]

    def patch(
        self,
        request,
        *args,
        **kwargs
    ):

        image_id = kwargs.get("pk")

        try:

            car_image = CarImage.objects.select_related(
                "car"
            ).get(
                id=image_id
            )

        except CarImage.DoesNotExist:

            return Response(
                {
                    "error": "Image not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )


        if car_image.car.seller != request.user:

            return Response(
                {
                    "error": (
                        "You can only modify "
                        "images from your own car."
                    )
                },
                status=status.HTTP_403_FORBIDDEN
            )


        CarImage.objects.filter(
            car=car_image.car
        ).update(
            is_primary=False
        )


        car_image.is_primary = True

        car_image.save(
            update_fields=[
                "is_primary"
            ]
        )


        return Response(
            {
                "id": car_image.id,
                "image": request.build_absolute_uri(
                    car_image.image.url
                ),
                "is_primary": True
            },
            status=status.HTTP_200_OK
        )


   