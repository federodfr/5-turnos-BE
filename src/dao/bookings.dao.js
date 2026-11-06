
import crypto from "crypto";
import {promises as fs} from "fs";

const PATH = "./src/data/bookings.json"

export class BookingsDAO {

    async getBookings() {
        const bookings = await fs.readFile(PATH, "utf-8");
        return JSON.parse(bookings)
    }

    async setBookings(bookings) {
        try {
            await fs.writeFile(PATH, JSON.stringify(bookings, null, 2));
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getById(id){
        const bookings = await this.getBookings();
        const booking = bookings?.find(booking => booking.id === id);

        return booking
    }

    async create(data){
        const bookings = await this.getBookings();
        const newBooking = {id: crypto.randomUUID(), ...data};
        bookings.push(newBooking);

        await this.setBookings(bookings);
        return newBooking;
    }

    async update(id, data){
        const bookings = await this.getBookings();
        const idx = bookings.findIndex(booking => booking.id === id)

        if(idx === -1) return null

        bookings[idx] = { ...bookings[idx], ...data}
        await this.setBookings(bookings)
        return bookings[idx]
    }
}