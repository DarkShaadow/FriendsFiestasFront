import {Component, OnInit} from '@angular/core';
import {SalonService} from "../../service/salon.service";
import {UserService} from "../../service/user.service";

@Component({
    selector: 'app-mainpage',
    templateUrl: './mainpage.component.html',
    styleUrls: ['./mainpage.component.css']
})
export class MainpageComponent implements OnInit {

    constructor(private salonService: SalonService,
                private userService: UserService) {
    }

    ngOnInit(): void {
    }

    onClick() {
        this.salonService.findAll();
    }

    onLogin() {
        this.userService.loginTest()
            .then(e => {
                console.log(e?.data.user[1]["Jwt-Token"][0]);
                localStorage.setItem("token", e?.data.user[1]["Jwt-Token"][0]);
            });
    }
}
