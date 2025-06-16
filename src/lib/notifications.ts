import { prisma } from './prisma'

export async function createNotification({
  userId,
  type,
  title,
  message,
  tripId
}: {
  userId: string
  type: 'NEW_BOOKING' | 'NEW_MESSAGE' | 'TRIP_UPDATE' | 'TRIP_CANCELLED'
  title: string
  message: string
  tripId?: string
}) {
  try {
    await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        tripId
      }
    })
  } catch (error) {
    // Silently fail notification creation to not break main functionality
  }
}

export async function createBookingNotification(tripId: string, userEmail: string, userName: string | null) {
  try {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      select: { title: true, creatorId: true }
    })

    if (trip) {
      await createNotification({
        userId: trip.creatorId,
        type: 'NEW_BOOKING',
        title: 'New booking on your trip',
        message: `${userName || userEmail} joined your trip "${trip.title}"`,
        tripId
      })
    }
  } catch (error) {
    // Silently fail
  }
}

export async function createMessageNotification(tripId: string, senderEmail: string, senderName: string | null) {
  try {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        bookings: {
          select: { userId: true }
        },
        creator: {
          select: { id: true }
        }
      }
    })

    if (trip) {
      // Get all participants (creator + booked users) except the sender
      const allParticipants = [
        trip.creator.id,
        ...trip.bookings.map(b => b.userId)
      ]

      const sender = await prisma.user.findFirst({
        where: { email: senderEmail },
        select: { id: true }
      })

      if (sender) {
        const recipients = allParticipants.filter(id => id !== sender.id)

        // Create notification for each recipient
        for (const recipientId of recipients) {
          await createNotification({
            userId: recipientId,
            type: 'NEW_MESSAGE',
            title: 'New message in trip chat',
            message: `${senderName || senderEmail} sent a message in "${trip.title}"`,
            tripId
          })
        }
      }
    }
  } catch (error) {
    // Silently fail
  }
}

export async function createTripUpdateNotification(tripId: string, updaterUserId: string) {
  try {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        bookings: {
          select: { userId: true }
        },
        creator: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    if (trip) {
      // Get all participants (creator + booked users) except the updater
      const allParticipants = [
        trip.creator.id,
        ...trip.bookings.map(b => b.userId)
      ]

      const recipients = allParticipants.filter(id => id !== updaterUserId)

      // Create notification for each recipient
      for (const recipientId of recipients) {
        await createNotification({
          userId: recipientId,
          type: 'TRIP_UPDATE',
          title: 'Trip details updated',
          message: `Trip "${trip.title}" has been updated by ${trip.creator.name || trip.creator.email}`,
          tripId
        })
      }
    }
  } catch (error) {
    // Silently fail
  }
}