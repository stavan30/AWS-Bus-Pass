from rest_framework import serializers

from bus_ticketing_api.models import BusSchedule
from bus_ticketing_api.serializers import BusScheduleSerializer
from ticket.models import Ticket, Payment, TicketPassenger, SeatingPlan


class PaymentSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Payment
        fields = ('payment_type', 'card_number', 'card_holder_name', 'card_expiry_date', 'card_cvv', 'user')


class TicketPassengerSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketPassenger
        fields = ('pk', 'first_name', 'last_name')


class TicketSerializer(serializers.ModelSerializer):
    route = BusScheduleSerializer()
    payment = PaymentSerializer()
    passengers = TicketPassengerSerializer(many=True)

    class Meta:
        model = Ticket
        fields = ('type', 'price', 'quantity', 'total', 'payment', 'route', 'user', 'passengers')
        read_only_fields = ('route',)

    def create(self, validated_data):
        print(validated_data)
        payment_data = validated_data.pop('payment')
        passengers_data = validated_data.pop('passengers')
        payment = Payment.objects.create(**payment_data)
        payment.save()
        validated_data['payment'] = payment
        validated_data['route'] = BusSchedule.objects.get(pk=self.initial_data['route']['pk'])
        ticket = Ticket.objects.create(**validated_data)
        ticket.payment = payment
        ticket.save()
        for passenger_data in passengers_data:
            passenger = TicketPassenger.objects.create(**passenger_data)
            passenger.save()
            ticket.passengers.add(passenger)
        return ticket

    def validate(self, attrs):
        print(attrs)
        return attrs


class SeatingPlanSerializer(serializers.ModelSerializer):
    ticket_passenger = TicketPassengerSerializer(read_only=True)
    route = BusScheduleSerializer(read_only=True)

    class Meta:
        model = SeatingPlan
        fields = ('seat_number', 'ticket_passenger', 'route')

    def create(self, validated_data):
        print(validated_data)
        validated_data['route'] = BusSchedule.objects.get(pk=self.initial_data['route']['pk'])
        validated_data['ticket_passenger'] = TicketPassenger.objects.get(pk=self.initial_data['ticket_passenger']['pk'])
        seating_plan = SeatingPlan.objects.create(**validated_data)
        seating_plan.route = validated_data['route']
        seating_plan.ticket_passenger = validated_data['ticket_passenger']
        seating_plan.save()
        return seating_plan