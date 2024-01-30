from datetime import timedelta, datetime

from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.shortcuts import render
from django.views import View
from rest_framework import viewsets, authentication
from rest_framework.generics import get_object_or_404
from rest_framework.mixins import CreateModelMixin
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from bus_ticketing_api.models import Places, BusSchedule
from bus_ticketing_api.serializers import PlacesSerializer, BusScheduleSerializer, UserSerializer
from ticket.models import Ticket, SeatingPlan
from ticket.serializers import TicketSerializer


class PlacesListAPIView(viewsets.ModelViewSet):
    queryset = Places.objects.all()
    serializer_class = PlacesSerializer
    authentication_classes = [authentication.TokenAuthentication, authentication.SessionAuthentication]
    permission_classes = []
    pagination_class = None


class RoutesSearchAPIView(viewsets.ModelViewSet):
    serializer_class = BusScheduleSerializer
    authentication_classes = [authentication.TokenAuthentication, authentication.SessionAuthentication]
    permission_classes = []
    pagination_class = None

    def get_queryset(self):
        source = self.request.query_params.get('source')
        destination = self.request.query_params.get('destination')
        departure_date = self.request.query_params.get('departure_date') or datetime.now()
        departure_date = datetime.strptime(departure_date, '%Y-%m-%d')
        print(source, destination, departure_date)
        arrival_date = self.request.query_params.get('arrival_date') or (departure_date + timedelta(days=3))
        result = BusSchedule.objects.filter(bus_route__route__destination__name=destination,
                                            bus_route__route__source__name=source, departure_time__gte=departure_date,
                                            arrival_time__lte=arrival_date)

        return result


class BusScheduleInfoAPIView(viewsets.ModelViewSet):
    serializer_class = BusScheduleSerializer
    authentication_classes = [authentication.TokenAuthentication, authentication.SessionAuthentication]
    permission_classes = []
    pagination_class = None
    queryset = BusSchedule.objects.all()

    def retrieve(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        pk = self.kwargs.get('pk')
        user = get_object_or_404(queryset, pk=pk)
        serializer = BusScheduleSerializer(user)
        return Response(serializer.data)


class CreateUserView(CreateModelMixin, GenericViewSet):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer
    authentication_classes = []
    permission_classes = []


# view for retrieving user details
class UserView(viewsets.ModelViewSet):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer
    authentication_classes = [authentication.TokenAuthentication, authentication.SessionAuthentication]
    permission_classes = []

    def retrieve(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        user = get_object_or_404(queryset, pk=request.user.pk)
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        user = get_object_or_404(queryset, pk=request.user.pk)
        serializer = UserSerializer(user)
        return Response(serializer.data)


def health_check(request):
    return JsonResponse({'status': 'ok'})


class MyTicketsView(viewsets.ModelViewSet):
    serializer_class = TicketSerializer
    authentication_classes = [authentication.TokenAuthentication, authentication.SessionAuthentication]
    permission_classes = []
    pagination_class = None

    def get_queryset(self):
        user = self.request.user
        result = Ticket.objects.filter(user=user)
        return result

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = TicketSerializer(queryset, many=True)
        # add the seat numbers to the response
        print(serializer.data)
        for ticket in serializer.data:
            for passenger in ticket['passengers']:
                passenger['seat_number'] = SeatingPlan.objects.get(ticket_passenger_id=passenger['pk']).seat_number
        return Response(serializer.data)


class TicketDownloadView(View):
    template_name = 'ticket.html'

    def get(self, request):
        # get the ticket id from the url
        ticket_id = request.GET.get('ticket_id')
        print(ticket_id)
        ticket = Ticket.objects.get(pk=ticket_id)
        # get the seat numbers for the passengers
        passengers = ticket.passengers.all()
        for passenger in passengers:
            passenger.seat_number = SeatingPlan.objects.get(ticket_passenger_id=passenger.pk).seat_number
        return render(request, self.template_name, {'ticket': ticket})
