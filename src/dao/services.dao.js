
import crypto from "crypto";
import {promises as fs} from "fs";

const PATH = "./src/data/services.json"

export class ServicesDAO {

    async getServices() {
        const services = await fs.readFile(PATH, "utf-8");
        return JSON.parse(services)
    }

    async setServices(services) {
        try {
            await fs.writeFile(PATH, JSON.stringify(services, null, 2));
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getAll() {
        return await this.getServices()
    }

    async getById(id){
        const services = await this.getServices();
        const service = services?.find(service => service.id === id);

        return service
    }

    async create(data){
        const services = await this.getServices();
        const newService = {id: crypto.randomUUID(), ...data};
        services.push(newService);

        await this.setServices(services);
        return newService;
    }

    async update(id, data){
        const services = await this.getServices();
        const idx = services.findIndex(service => service.id === id)

        if(idx === -1) return null

        services[idx] = { ...services[idx], ...data}
        await this.setServices(services)
        return services[idx]
    }

    async delete(id){
        const services = await this.getServices();
        const idx = services.findIndex(service => service.id === id)

        if(idx === -1) return null

        const deletedService = services.splice(idx,1)[0]
        await this.setServices(services)
        return deletedService
    }
}