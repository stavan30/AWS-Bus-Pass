import csv
import math
import os
import random
import sys
from datetime import datetime, timedelta
from math import cos, sqrt, asin

import django

sys.path.append('/')
os.environ['DJANGO_SETTINGS_MODULE'] = 'bus_ticketing_app.settings'

django.setup()

from bus_ticketing_api.models import Places, Routes, Bus, BusRoutes, BusSchedule
from django.contrib.auth.models import User


# find distance between two places using latitude and longitude in miles
def distance(lat1, lon1, lat2, lon2):
    p = 0.017453292519943295
    a = 0.5 - cos((lat2 - lat1) * p) / 2 + cos(lat1 * p) * cos(lat2 * p) * (1 - cos((lon2 - lon1) * p)) / 2
    dis = 12742 * asin(sqrt(a))
    return float(dis)


def add_places():
    with open('./data/places2.csv', 'r') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        for row in csv_reader:
            place = Places()
            place.name = row['Name']
            place.latitude = row['Latitude']
            place.longitude = row['Longitude']
            place.save()


def add_bus():
    bus = Bus()
    bus.id = 1
    bus.name = 'Aero King'
    bus.model = 'Volvo 7700'
    bus.seating_capacity = 24
    bus.save()

    bus = Bus()
    bus.id = 2
    bus.name = 'ComfortClass S 500'
    bus.model = 'Setra'
    bus.seating_capacity = 28
    bus.save()

    bus = Bus()
    bus.id = 3
    bus.name = 'F94'
    bus.model = 'Scania'
    bus.seating_capacity = 36
    bus.save()

    bus = Bus()
    bus.id = 4
    bus.name = 'Intouro'
    bus.model = 'Mercedes-Benz'
    bus.seating_capacity = 40
    bus.save()


def add_routes():
    places = Places.objects.all()
    Routes.objects.all().delete()
    all_routes = []
    for place in places:
        for place2 in places:
            if place != place2:
                route = Routes()
                route.source = place
                route.destination = place2
                route.distance = distance(place.latitude, place.longitude, place2.latitude, place2.longitude)
                all_routes.append(route)

    Routes.objects.bulk_create(all_routes)


def add_bus_routes():
    routes = Routes.objects.all()
    buses = Bus.objects.all()
    bus_routes = []
    for route in routes:
        for bus in buses:
            bus_route = BusRoutes()
            bus_route.bus = bus
            bus_route.route = route
            if bus.id == 1:
                bus_route.duration = math.ceil(route.distance / 65)
                bus_route.price = route.distance * 0.24
            elif bus.id == 2:
                bus_route.duration = math.ceil(route.distance / 60)
                bus_route.price = route.distance * 0.22
            elif bus.id == 3:
                bus_route.duration = math.ceil(route.distance / 70)
                bus_route.price = route.distance * 0.30
            elif bus.id == 4:
                bus_route.duration = math.ceil(route.distance / 40)
                bus_route.price = route.distance * 0.15
            bus_routes.append(bus_route)
    BusRoutes.objects.bulk_create(bus_routes)


# add_bus_routes()
def add_bus_schedules():
    bus_schedules = []
    bus_routes = BusRoutes.objects.all()
    for bus_route in bus_routes:
        # add schedule for next 30 days for each bus route where departure time is between 6:00 AM and 9:00 PM
        for i in range(5):
            bus_schedule = BusSchedule()
            bus_schedule.bus_route = bus_route
            bus_schedule.departure_time = datetime.now().replace(hour=random.randint(6, 21), minute=0, second=0,
                                                                 microsecond=0) + timedelta(days=i)
            bus_schedule.arrival_time = bus_schedule.departure_time + timedelta(hours=bus_route.duration)
            bus_schedules.append(bus_schedule)

    BusSchedule.objects.bulk_create(bus_schedules)


add_places()
add_routes()
add_bus()
add_bus_routes()
add_bus_schedules()

# create superuser

User.objects.create_superuser('admin', "admin@admin.com", 'admin').save()

