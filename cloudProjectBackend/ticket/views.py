import json

from django.contrib.auth.models import User
from rest_framework import viewsets, authentication
from rest_framework.permissions import IsAuthenticated

from ticket.models import Ticket, SeatingPlan
from ticket.serializers import TicketSerializer, SeatingPlanSerializer
from bus_ticketing_api.models import BusRoutes, BusSchedule


# Create your views here.

class CheckoutView(viewsets.ModelViewSet):
    serializer_class = TicketSerializer
    authentication_classes = [authentication.TokenAuthentication, authentication.SessionAuthentication]
    permission_classes = [IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        ticket = Ticket.objects.filter(user=self.request.user)
        return ticket

    def create(self, request, *args, **kwargs):
        print(json.dumps(request.data))
        request.data['user'] = request.user.id
        return super().create(request, *args, **kwargs)


class SeatingPlanView(viewsets.ModelViewSet):
    serializer_class = SeatingPlanSerializer
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [IsAuthenticated]
    pagination_class = None

    def get_permissions(self):
        print(self.action)
        print(self.request.user)
        if self.action not in ('post', 'create'):
            self.permission_classes = []
            self.authentication_classes = []
        return super(self.__class__, self).get_permissions()

    def get_queryset(self):
        route_id = self.request.query_params.get('route_id')
        seating_plan = SeatingPlan.objects.filter(route_id=route_id)
        return seating_plan

    def create(self, request, *args, **kwargs):
        print(json.dumps(request.data))
        return super().create(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        print(json.dumps(request.data))
        return super().list(request, *args, **kwargs)
