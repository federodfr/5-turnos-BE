import {ServicesRepository} from "../repositories/services.repository.js"

class ServicesService {

    constructor(repository = new ServicesRepository()) {
        this.repository = repository;
    }

    async getServices() {
        try {
            const services = await this.repository.getAll();

            if(!services || services.length === 0) {
                throw new Error("No se han agregado servicios")
            }

            return services
        } catch(error) {
            console.error(error);
            throw error;
        }
    }

    async getServicesById(id) {
        try {
            const service = await this.repository.getById(id);

            if(!service) {
                throw new Error("Servicio no encontrado");
            }

            return service;
        } catch(error) {
            console.log(error)
            throw error
        }
        
    }

    async createService(data) {
        try {
            const {name, description, duration, price, category, available} = data;
            
            if(!name || !description || !duration || !price || !category || !available) {
                throw new Error("Todos los campos son requeridos");
            }

            const newService = await this.repository.create(data);

            return newService;
        } catch (error) {
            console.log("entra error: ", error)
            throw error;
        }
    }

    async updateService(id, data) {
        try {

            if(JSON.stringify(data) === '{}' || !data){
                throw new Error("Se debe setear al menos un valor");
            }

            if(data.id) {
                throw new Error("El ID no puede ser modificado")
            }

            const service = await this.repository.update(id, data);

            if(!service) {
                throw new Error("Servicio no encontrado")
            }

            return service
        } catch (error) {
            console.error(error);
            throw error;
        }

    }

    async deleteService(id) {
        try {
            const service = await this.repository.delete(id)

            if (!service) { 
                throw new Error("Servicio no encontrado"); 
            }

            return service
        } catch(error) {
            console.log(error);
            throw error
        }
    }
}

export default ServicesService;