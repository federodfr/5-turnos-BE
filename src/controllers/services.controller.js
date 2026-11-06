import ServiceServices from "../services/services.service.js"

const serviceServices = new ServiceServices();

export const getServices = async(req, res) => {
    try {
        const services =  await serviceServices.getServices();

        return res.status(200).json({
            status: "success",
            payload: services
        })

    } catch(error) {
        return res.status(500).json({
            status: "error",
            message: error.message
        })
    }
}

export const getServicesById = async(req, res) =>  {
    try {
        const service = await serviceServices.getServicesById(req.params.sid);

        return res.status(200).json({
            status: "success",
            payload: service
        })
        
    } catch(error) {
        return res.status(404).json({
            status: "error",
            message: error.message
        })
    }
    
}

export const createService = async(req, res) => {
    try {

        if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
            return res.status(400).json({ error: "El body debe ser un objeto JSON" });
          }

        const service = await serviceServices.createService(req.body);
        
        return res.status(201).json({
            status: "success",
            payload: service
        })

    } catch (error) {
        return res.status(404).json({
            status: "error",
            message: error.message
        })
    }
}

export const updateService = async(req, res) => {
    try {

        if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
            return res.status(400).json({ error: "El body debe ser un objeto JSON" });
          }

        const service = await serviceServices.updateService(req.params.sid, req.body)

        return res.status(200).json({
            status: "success",
            payload: service
        })

    } catch (error) {
        return res.status(404).json({
            status: "error",
            message: error.message
        })
    }

}

export const deleteService = async(req, res) => {
    try {
        const service = await serviceServices.deleteService(req.params.sid)

        return res.status(200).json({
            status: "success",
            payload: service
        })

    } catch(error) {
        return res.status(404).json({
            status: "error",
            message: error.message
        })
    }
}