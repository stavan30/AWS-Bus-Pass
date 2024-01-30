from django.contrib import admin
from django.db import models
from rest_framework.authtoken.models import Token


class Places(models.Model):
    name = models.CharField(max_length=100)
    longitude = models.FloatField()
    latitude = models.FloatField()

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Place"
        verbose_name_plural = "Places"


admin.site.register(Places)


class Bus(models.Model):
    id = models.IntegerField(primary_key=True, auto_created=True)
    name = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    seating_capacity = models.IntegerField()

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Bus"
        verbose_name_plural = "Buses"


admin.site.register(Bus)


class Routes(models.Model):
    id = models.AutoField(primary_key=True, auto_created=True)
    source = models.ForeignKey(Places, on_delete=models.CASCADE, related_name='source')
    destination = models.ForeignKey(Places, on_delete=models.CASCADE, related_name='destination')
    distance = models.IntegerField()

    def __str__(self):
        return self.source.name + ' - ' + self.destination.name

    class Meta:
        verbose_name = "Route"
        verbose_name_plural = "Routes"


admin.site.register(Routes)


class BusRoutes(models.Model):
    bus = models.ForeignKey(Bus, on_delete=models.CASCADE)
    route = models.ForeignKey(Routes, on_delete=models.CASCADE)
    duration = models.IntegerField()
    price = models.IntegerField()

    def __str__(self):
        return self.bus.name + ' - ' + self.route.source.name + ' - ' + self.route.destination.name

    class Meta:
        verbose_name = "Bus Route"
        verbose_name_plural = "Bus Routes"


admin.site.register(BusRoutes)


class BusSchedule(models.Model):
    bus_route = models.ForeignKey(BusRoutes, on_delete=models.CASCADE)
    departure_time = models.DateTimeField()
    arrival_time = models.DateTimeField()

    def __str__(self):
        return self.bus_route.bus.name + ' - ' + self.bus_route.route.source.name + ' - ' \
               + self.bus_route.route.destination.name \
               + ' - ' + self.departure_time.strftime("%Y-%m-%d %H:%M") + ' - ' + \
               self.arrival_time.strftime("%Y-%m-%d %H:%M")

    class Meta:
        verbose_name = "Bus Schedule"
        verbose_name_plural = "Bus Schedules"


admin.site.register(BusSchedule)
