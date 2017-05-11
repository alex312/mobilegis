import { Injectable } from '@angular/core'
import { ApiClientService, DataManager } from '../../../base';
import { Vehicle } from '../data/vehicle';
import { UserService } from '../../user';


@Injectable()
export class VehiclesService {
    allVehicles: DataManager<Vehicle> = new DataManager<Vehicle>();
    constructor(private apiClient: ApiClientService,
        private user: UserService) {
        user.subjectLogin(this.init.bind(this));
    }

    init() {
        this.getAllEquipmentss().then((members) => {
            this.DataManager.reset(members);
        })
    }
    private url = "api/vehicle";
    getAllEquipmentss() {
        let promise = this.apiClient.get(this.url).then((users) => {
            let vehicles: Vehicle[] = [];
            users.map((data) => {
                let vehicle = new Vehicle();
                vehicle.Id = data.Id;
                vehicle.Name = data.Name;
                vehicles.push(vehicle);
            });
            return vehicles;
        });
        return promise;
    }

    get DataManager() {
        return this.allVehicles;
    }
}