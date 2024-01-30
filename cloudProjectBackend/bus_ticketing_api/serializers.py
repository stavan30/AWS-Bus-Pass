from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from rest_framework import serializers

from bus_ticketing_api.models import Bus, Places, Routes, BusRoutes, BusSchedule


class PlacesSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Places
        fields = ('name', 'longitude', 'latitude')


class BusSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Bus
        fields = ('id', 'name', 'model', 'seating_capacity')
        extra_kwargs = {
            'id': {'read_only': False, 'validators': []},
        }


class RoutesSerializer(serializers.HyperlinkedModelSerializer):
    source = PlacesSerializer()
    destination = PlacesSerializer()

    class Meta:
        model = Routes
        fields = ('id', 'source', 'destination', 'distance')


class BusRoutesSerializer(serializers.HyperlinkedModelSerializer):
    bus = BusSerializer()
    route = RoutesSerializer()

    class Meta:
        model = BusRoutes
        fields = ('bus', 'route', 'duration', 'price')


class BusScheduleSerializer(serializers.HyperlinkedModelSerializer):
    bus_route = BusRoutesSerializer()

    class Meta:
        model = BusSchedule
        fields = ('pk', 'bus_route', 'departure_time', 'arrival_time')
        extra_kwargs = {
            'pk': {'read_only': False},
            'bus_route': {'validators': []},
        }

    def create(self, validated_data):
        print(validated_data)

    def validate(self, attrs):
        print("bus_route", attrs)
        return attrs


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'email', 'first_name', 'last_name')
        extra_kwargs = {
            'password': {'write_only': True}
        }
        read_only_fields = ('id',)

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )

        user.set_password(validated_data['password'])
        user.save()

        return user
