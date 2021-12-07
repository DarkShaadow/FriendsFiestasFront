import {Component, OnInit} from '@angular/core';
import {SalonService} from "../../service/salon.service";
import {UserService} from "../../service/user.service";
import {Salon} from "../../model/Salon";
import {Subscription} from "rxjs";
import {Member} from "../../model/Member";
import {FormBuilder, FormGroup} from "@angular/forms";
import {User} from "../../model/User";
import {Task} from "../../model/Task";
import {Adresse} from "../../model/Adresse";
import {AdresseService} from "../../service/adresse.service";

@Component({
    selector: 'app-mainpage',
    templateUrl: './mainpage.component.html',
    styleUrls: ['./mainpage.component.css']
})
export class MainpageComponent implements OnInit {

    creationSalon: boolean;
    creationTache: boolean;
    ajoutMembre: boolean;
    showingRegistration: boolean;
    showingConnection: boolean;
    showingSalon: boolean;
    connected: boolean;

    connexionForm: FormGroup;
    registerForm: FormGroup;
    membreForm: FormGroup;
    salonForm: FormGroup;
    tacheForm: FormGroup;

    salon: Salon;

    listUser: User[];
    listTache: Task[] | undefined;
    listSalon: Salon[];
    listMembre: Member[] | undefined;
    private userSubscribe: Subscription;
    private salonSubscribe: Subscription;

    constructor(private adresseService: AdresseService,
                private salonService: SalonService,
                private userService: UserService,
                private formBuilder: FormBuilder) {
        this.creationSalon = false;
        this.creationTache = false;
        this.ajoutMembre = false;
        this.showingRegistration = false;
        this.showingConnection = false;
        this.showingSalon = false;
        this.connected = false;

        this.listUser = [];
        this.listTache = [];
        this.listSalon = [];
        this.listMembre = [];
        this.userSubscribe = new Subscription();
        this.salonSubscribe = new Subscription();

        this.salon = new Salon(
            0,
            "",
            "",
            new Date(),
            this.getUser(),
            new Adresse(
                0,
                "",
                "",
                ""
            ),
            [],
            []
        )

        this.connexionForm = this.formBuilder.group({
            pseudo: [""],
            password: [""]
        });
        this.registerForm = this.formBuilder.group({
            pseudo: [""],
            email: [""],
            password: [""]
        });
        this.membreForm = this.formBuilder.group({
            user: []
        });
        this.salonForm = this.formBuilder.group({
            name: [""],
            description: [""],
            dateEvent: [],
            street: [],
            postalCode: [],
            city: []
        });
        this.tacheForm = this.formBuilder.group({
            content: [""]
        });
    }

    ngOnInit(): void {
        this.userSubscribe = this.userService.subjectList.subscribe(
            (users: User[]) => {
                this.listUser = users;
                console.log(users);
            }
        );
        this.salonSubscribe = this.salonService.subjectList.subscribe(
            (salons: Salon[]) => {
                this.listSalon = salons;
            }
        );

        this.updateSalon();
    }

    resetSalon() {
        this.listTache = [];
        this.listMembre = [];

        this.creationTache = false;
        this.creationSalon = false;
        this.ajoutMembre = false;
        this.showingRegistration = false;
        this.showingConnection = false;
        this.showingSalon = false;
    }

    updateSalon() {
        var id;

        if ((id = localStorage.getItem("id")) != null) {
            this.salonService.findAllSalonsByIdUser(+id);
        }
    }

    selectSalon(id: number) {
        this.resetSalon();
        this.showingSalon = true;

        this.listSalon.forEach(e => {
            if (e.id == id)
                this.salon = e;
        })

        this.listMembre = this.salon?.members;
        this.listTache = this.salon?.tasks;
    }

    createSalon() {
        this.resetSalon();
        this.creationSalon = true;
    }

    onCreateSalon() {
        const formValue = this.salonForm.value;
        const newAdresse = new Adresse(
            0,
            formValue["street"],
            formValue["postalCode"],
            formValue["city"]
        );
        const newSalon = new Salon(
            0,
            formValue["name"],
            formValue["description"],
            new Date(formValue["dateEvent"]),
            this.getUser(),
            newAdresse,
            [],
            []
        );

        this.adresseService.add(newAdresse).then(
            e => {
                console.log(e);

                newSalon.addressEvent.id = e?.data.address.id;

                console.log(newSalon);

                this.salonService.add(newSalon).then(
                    e => {
                        console.log("Inception");
                        console.log(e);
                        console.log("Inception");
                        console.log(e?.data.salon.id);
                        this.salonService.ajouterAdresse(e?.data.salon.id, newAdresse).then(() => this.refresh());
                        this.connected = true;
                        this.refresh();
                    }
                );
            }
        );
    }

    onCreateTache() {
        const formValue = this.tacheForm.value;
        const newTache = new Task(
            0,
            formValue["content"],
            this.getUser()
        );

        this.salonService.ajouterTask(this.salon, newTache).then(
            () => {
                this.refresh();
                this.salonService.getById(this.salon.id).then(
                    e => {
                        this.salon = e?.data.salon;
                        this.listMembre = this.salon?.members;
                        this.listTache = this.salon?.tasks;
                        this.refresh();
                        this.showingSalon = true;
                    }
                );
            }
        );
    }

    createTache() {
        this.creationTache = true;
        this.creationSalon = false;
        this.showingSalon = false;
    }

    getUser(): User {
        return new User(
            // @ts-ignore
            +localStorage.getItem("id"),
            // @ts-ignore
            localStorage.getItem("pseudo"),
            "",
            ""
        );
    }

    refresh() {
        this.updateSalon();

        this.creationTache = false;
        this.creationSalon = false;
        this.showingRegistration = false;
        this.showingConnection = false;
        this.showingSalon = false;

        console.log("End refresh");
    }

    showingMenuDroite() {
        return (this.showingSalon || this.creationTache);
    }

    onConnexion() {
        const formValue = this.connexionForm.value;
        const newUser = new User(
            0,
            formValue["pseudo"],
            "",
            formValue["password"],
        );

        this.userService.login(newUser).then(
            e => {
                console.log(e);
                localStorage.setItem("token", e?.data.user[1]["Jwt-Token"][0]);
                localStorage.setItem("id", e?.data.user[0].id);
                localStorage.setItem("pseudo", e?.data.user[0].pseudo);
                this.refresh();
                this.connected = true;
            }
        );
    }

    connexion() {
        this.refresh();
        this.showingConnection = true;
    }

    onRegistration() {
        const formValue = this.registerForm.value;
        const newUser = new User(
            0,
            formValue["pseudo"],
            formValue["email"],
            formValue["password"]
        );

        this.userService.register(newUser).then(
            () => {
                this.userService.login(newUser).then(
                    e => {
                        console.log(e);
                        localStorage.setItem("token", e?.data.user[1]["Jwt-Token"][0]);
                        localStorage.setItem("id", e?.data.user[0].id);
                        localStorage.setItem("pseudo", e?.data.user[0].pseudo);
                        this.refresh();
                        this.connected = true;
                    }
                );
            }
        );
    }

    register() {
        this.refresh();
        this.showingRegistration = true;
    }

    deconnexion() {
        localStorage.setItem("token", "");
        localStorage.setItem("id", "");
        localStorage.setItem("pseudo", "");
        this.refresh();
        this.connected = false;
    }

    amIHost() {
        // @ts-ignore
        return this.salon.host.id === +localStorage.getItem("id");
    }

    ajouterMembre() {
        this.refresh();
        this.ajoutMembre = true;
        this.userService.findAll();
    }

    onAjouterMembre() {
        const formValue = this.membreForm.value;
        const userId = +formValue["user"];

        this.salonService.ajouterMemberToSalon(this.salon, userId).then(
            e => {
                this.refresh();
                this.ajoutMembre = true;
            }
        )
    }
}
