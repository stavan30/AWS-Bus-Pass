from django.contrib import admin
from django.contrib.auth.models import User
from django.db import models

from bus_ticketing_api.models import BusSchedule

CREDIT_CARD = 'credit_card'

PAYMENT_CHOICES = (
    (CREDIT_CARD, 'credit_card'),
)

TICKET_PASS = 'ticket_pass'
TICKET_SINGLE = 'ticket_single'

TICKET_TYPE_CHOICES = (
    (TICKET_PASS, TICKET_PASS),
    (TICKET_SINGLE, TICKET_SINGLE),
)


class Payment(models.Model):
    id = models.AutoField(primary_key=True, auto_created=True)
    payment_type = models.CharField(max_length=50, choices=PAYMENT_CHOICES, default=CREDIT_CARD)
    card_number = models.CharField(max_length=100)
    card_holder_name = models.CharField(max_length=100)
    card_expiry_date = models.CharField(max_length=100)
    card_cvv = models.IntegerField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=None)

    def __str__(self):
        return str(self.id)

    class Meta:
        verbose_name = "Payment"
        verbose_name_plural = "Payments"


admin.site.register(Payment)


class TicketPassenger(models.Model):
    id = models.AutoField(primary_key=True, auto_created=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)

    def __str__(self):
        return self.first_name + ' ' + self.last_name

    class Meta:
        verbose_name = "Ticket Passenger"
        verbose_name_plural = "Ticket Passengers"


admin.site.register(TicketPassenger)


# Create your models here.
class Ticket(models.Model):
    id = models.AutoField(primary_key=True)
    type = models.CharField(max_length=50, choices=TICKET_TYPE_CHOICES, default=TICKET_SINGLE)
    price = models.IntegerField()
    quantity = models.IntegerField()
    total = models.FloatField()
    payment = models.ForeignKey(Payment, on_delete=models.CASCADE)
    route = models.ForeignKey(BusSchedule, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=None)
    passengers = models.ManyToManyField(TicketPassenger)

    def __str__(self):
        return self.type + ' - ' + self.route.bus_route.bus.name

    class Meta:
        verbose_name = "Ticket"
        verbose_name_plural = "Tickets"


admin.site.register(Ticket)


class SeatingPlan(models.Model):
    id = models.AutoField(primary_key=True)
    route = models.ForeignKey(BusSchedule, on_delete=models.CASCADE)
    seat_number = models.IntegerField()
    ticket_passenger = models.ForeignKey(TicketPassenger, on_delete=models.CASCADE, default=None, null=True)

    def __str__(self):
        return str(self.seat_number) + ' - ' + self.ticket_passenger.first_name + ' ' + self.ticket_passenger.last_name

    class Meta:
        verbose_name = "Seating Plan"
        verbose_name_plural = "Seating Plans"


admin.site.register(SeatingPlan)
