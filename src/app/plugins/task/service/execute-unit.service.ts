import { Injectable } from "@angular/core"

import { ApiClientService } from '../../../base'
import { MembersService } from './members.service';
import { EquipmentsService } from './equipments.service';
import { VehiclesService } from './vehicles.service';
// import {AllMembers} from '../mock/member.mock';
// // import {AllVehicles} from '../service/vehicles.service';
// import {AllVehicles} from '../mock/member.mock';
// // import {AllEquipments} from '../service/equipments.service';
// import {AllEquipments} from '../mock/member.mock';


@Injectable()
export class ExecuteUnitService {
    constructor(private apiClient: ApiClientService,
        private memberService: MembersService,
        private equipmentService: EquipmentsService,
        private vehicleService: VehiclesService) {

    }

    getExecutUnit(taskId) {
        let executantsPromise = this.apiClient.get(`api/relation/executant?taskId=${taskId}`)
            .then((data) => {
                let memberIds = data.Many;
                return memberIds.map(id => this.memberService.DataManager.Items.find(function (item) {
                    return item.UserId === id;
                }))
            });

        let vehiclesPromise = this.apiClient.get(`api/relation/vehicle?taskId=${taskId}`)
            .then((data) => {
                let vehicleIds = data.Many;
                return vehicleIds.map(id => this.vehicleService.DataManager.Items.find(function (item) {
                    return item.Id === id;
                }))
            });

        let equipmentsPromise = this.apiClient.get(`api/relation/equipment?taskId=${taskId}`)
            .then((data) => {
                let equipmentIds = data.Many;
                return equipmentIds.map(id => this.equipmentService.DataManager.Items.find(function (item) {
                    return item.Id === id;
                }))
            });;

        let promiseArray = [executantsPromise, vehiclesPromise, equipmentsPromise];
        let promise = Promise.all(promiseArray).then(results => {
            return {
                members: results[0] ? results[0] : [],
                vehicles: results[1] ? results[1] : [],
                equipments: results[2] ? results[2] : []
            }
        })

        return promise;
    }

    saveUnit(taskId, util) {
        let executantPromise = this.apiClient.put(`api/relation/executant/${taskId}`, util.members || []);
        let vehiclePromise = this.apiClient.put(`api/relation/vehicle/${taskId}`, util.vehicles || []);
        let equipmentPromise = this.apiClient.put(`api/relation/equipment/${taskId}`, util.equipments || []);

        let promiseArray = [executantPromise, vehiclePromise, equipmentPromise];

        let promise = Promise.all(promiseArray);
        return promise;
    }

}