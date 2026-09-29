from django.db import models
from django.contrib.auth.models import User


class Car(models.Model):

    FUEL_CHOICES = [
        ("Petrol", "Petrol"),
        ("Diesel", "Diesel"),
        ("Electric", "Electric"),
        ("Hybrid", "Hybrid"),
    ]

    TRANSMISSION_CHOICES = [
        ("Manual", "Manual"),
        ("Automatic", "Automatic"),
    ]

    STATUS_CHOICES = [
        ("Available", "Available"),
        ("Sold", "Sold"),
    ]

    seller = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="cars"
    )

    brand = models.CharField(
        max_length=100
    )

    model = models.CharField(
        max_length=100
    )

    variant = models.CharField(
        max_length=100,
        blank=True
    )

    year = models.PositiveIntegerField()

    price = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    mileage = models.PositiveIntegerField()

    fuel_type = models.CharField(
        max_length=20,
        choices=FUEL_CHOICES
    )

    transmission = models.CharField(
        max_length=20,
        choices=TRANSMISSION_CHOICES
    )

    location = models.CharField(
        max_length=150
    )

    description = models.TextField(
        blank=True
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="Available"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return f"{self.brand} {self.model} ({self.year})"


class Favorite(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="favorites"
    )

    car = models.ForeignKey(
        Car,
        on_delete=models.CASCADE,
        related_name="favorited_by"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:

        constraints = [
            models.UniqueConstraint(
                fields=["user", "car"],
                name="unique_user_car_favorite"
            )
        ]

    def __str__(self):

        return f"{self.user.username} → {self.car}"




class CarImage(models.Model):

    car = models.ForeignKey(
        Car,
        on_delete=models.CASCADE,
        related_name="images"
    )

    image = models.ImageField(
        upload_to="cars/"
    )

    is_primary = models.BooleanField(
        default=False
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"{self.car.brand} {self.car.model} image"