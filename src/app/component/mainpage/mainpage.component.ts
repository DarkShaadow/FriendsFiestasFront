import {Component, OnInit} from '@angular/core';
import {SalonService} from "../../service/salon.service";
import {UserService} from "../../service/user.service";
import {Salon} from "../../model/Salon";
import {Subscription} from "rxjs";
import {Member} from "../../model/Member";

@Component({
    selector: 'app-mainpage',
    templateUrl: './mainpage.component.html',
    styleUrls: ['./mainpage.component.css']
})
export class MainpageComponent implements OnInit {

    listTache: Task[];
    listSalon: Salon[];
    listMembre: Member[];
    private salonSubscribe: Subscription;

    constructor(private salonService: SalonService,
                private userService: UserService) {
        this.listTache = [];
        this.listSalon = [];
        this.listMembre = [];
        this.salonSubscribe = new Subscription();
    }

    ngOnInit(): void {
        this.salonSubscribe = this.salonService.subjectList.subscribe(
            (salons: Salon[]) => {
                this.listSalon = salons;
            }
        );

        this.updateSalon();
    }

    updateSalon() {
        var id;

        if ((id = localStorage.getItem("id")) != null) {
//            this.salonService.findAllSalonsByIdHost(+id);
            this.salonService.findAll();
        }
    }
    selectSalon(id: number) {
        console.log(id.toString());
    }

    onClick() {
        this.updateSalon();
    }

    onLogin() {
        this.userService.loginTest()
            .then(e => {
                localStorage.setItem("token", e?.data.user[1]["Jwt-Token"][0]);
                localStorage.setItem("id", e?.data.user[0].id);
                this.updateSalon();
            });
    }
}
