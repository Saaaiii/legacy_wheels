from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Car, CarImage, Favorite


class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True,
        min_length=8
    )

    confirm_password = serializers.CharField(
        write_only=True
    )

    class Meta:

        model = User

        fields = [
            "username",
            "email",
            "password",
            "confirm_password",
        ]

    def validate(self, data):

        if data["password"] != data["confirm_password"]:

            raise serializers.ValidationError(
                "Passwords do not match."
            )

        return data

    def create(self, validated_data):

        validated_data.pop("confirm_password")

        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"]
        )

        return user



class CarImageSerializer(serializers.ModelSerializer):

    image = serializers.SerializerMethodField()

    class Meta:
        model = CarImage

        fields = [
            "id",
            "image",
            "is_primary",
        ]

    def get_image(self, obj):

        if not obj.image:
            return None

        request = self.context.get("request")

        image_url = obj.image.url

        if request:
            return request.build_absolute_uri(
                image_url
            )

        return image_url

 
            


class CarSerializer(serializers.ModelSerializer):

    seller = serializers.ReadOnlyField(
        source="seller.username"
    )

    images = CarImageSerializer(
        many=True,
        read_only=True
    )

    class Meta:

        model = Car

        fields = [
            "id",
            "seller",
            "brand",
            "model",
            "variant",
            "year",
            "price",
            "mileage",
            "fuel_type",
            "transmission",
            "location",
            "description",
            "status",
            "images",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "seller",
            "images",
            "created_at",
            "updated_at",
        ]


class FavoriteSerializer(serializers.ModelSerializer):

    car = CarSerializer(
        read_only=True
    )

    class Meta:

        model = Favorite

        fields = [
            "id",
            "car",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "car",
            "created_at",
        ]

  