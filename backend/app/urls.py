from django.urls import path

from .views import RegisterView
from rest_framework_simplejwt.views import TokenObtainPairView
from .views import (
    RegisterView,
    CarListCreateView,
    CarDetailView,
    CarImageUploadView,
    FavoriteListCreateView,
    FavoriteDeleteView,
    MyCarsView,
    CurrentUserView,
    CarImageDeleteView,
    CarImagePrimaryView,
)

urlpatterns = [ path("register/",RegisterView.as_view(),name="register"),
                path("login/",TokenObtainPairView.as_view(),name="login"),
                path( "cars/",CarListCreateView.as_view(),name="car-list"),
                path("cars/<int:pk>/",CarDetailView.as_view(),name="car-detail"),
                path(
                        "cars/images/",
                        CarImageUploadView.as_view(),
                        name="car-image-upload"
                    ),
                path(
                            "cars/images/",
                            CarImageUploadView.as_view(),
                            name="car-image-upload"
                        ),
                path(
                        "favorites/",
                        FavoriteListCreateView.as_view(),
                        name="favorite-list"
                    ),

                path(
                        "favorites/<int:car_id>/",
                        FavoriteDeleteView.as_view(),
                        name="favorite-delete"
                    ),
                path(
                    "my-cars/",
                    MyCarsView.as_view(),
                    name="my-cars"
                ),
                path(
                    "me/",
                    CurrentUserView.as_view(),
                    name="current-user"
                ),
                
                path(
                    "cars/images/<int:pk>/",
                    CarImageDeleteView.as_view(),
                    name="car-image-delete"
                ),

                path(
                    "cars/images/<int:pk>/primary/",
                    CarImagePrimaryView.as_view(),
                    name="car-image-primary"
                ),



        
]