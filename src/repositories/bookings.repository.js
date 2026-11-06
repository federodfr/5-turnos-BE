import {BookingsDAO} from "../dao/bookings.dao.js"

export class BookingsRepository {

    constructor(dao = new BookingsDAO()) {
        this.dao = dao
    }

    async getById(id){
        return await this.dao.getById(id)
    }

    async create(data){
        return await this.dao.create(data)
    }

    async update(id, data){
        return await this.dao.update(id, data)
    }
}