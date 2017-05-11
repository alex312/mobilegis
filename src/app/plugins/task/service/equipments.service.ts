import { Injectable } from '@angular/core'
import { ApiClientService, DataManager } from '../../../base';
import { Equipment } from '../data/equipment';

import { UserService } from '../../user';



@Injectable()
export class EquipmentsService {
    allEquipments: DataManager<Equipment> = new DataManager<Equipment>();

    constructor(private apiClient: ApiClientService,
        private user: UserService) {
        user.subjectLogin(this.init.bind(this));
    }

    init() {
        this.getAllEquipmentss().then((members) => {
            this.DataManager.reset(members);
        })
    }
    private url = "api/equipment";
    getAllEquipmentss() {
        let promise = this.apiClient.get(this.url).then((users) => {
            let equipments: Equipment[] = [];
            users.map((data) => {
                let equipment = new Equipment();
                equipment.Id = data.Id;
                equipment.Name = data.Name;
                equipments.push(equipment);
            });
            return equipments;
        });
        return promise;
    }

    get DataManager() {
        return this.allEquipments;
    }
}