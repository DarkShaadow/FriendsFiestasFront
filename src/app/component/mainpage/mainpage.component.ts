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
import {Message} from "../../model/Message";
import {formatDate} from '@angular/common';

@Component({
    selector: 'app-mainpage',
    templateUrl: './mainpage.component.html',
    styleUrls: ['./mainpage.component.css']
})
export class MainpageComponent implements OnInit {

    creationSalon: boolean;
    creationTache: boolean;
    affecteMembre: boolean;
    ajoutMembre: boolean;
    showingRegistration: boolean;
    showingConnection: boolean;
    showingSalon: boolean;
    connected: boolean;

    connexionForm: FormGroup;
    registerForm: FormGroup;
    affecteForm: FormGroup;
    membreForm: FormGroup;
    salonForm: FormGroup;
    tacheForm: FormGroup;
    chatForm: FormGroup;

    salon: Salon;
    tache: Task;

    listUser: User[];
    listTache: Task[] | undefined;
    listSalon: Salon[];
    listMembre: Member[] | undefined;
    listMessage: Message[];
    private userSubscribe: Subscription;
    private salonSubscribe: Subscription;

    constructor(private adresseService: AdresseService,
                private salonService: SalonService,
                private userService: UserService,
                private formBuilder: FormBuilder) {
        this.creationSalon = false;
        this.creationTache = false;
        this.affecteMembre = false;
        this.ajoutMembre = false;
        this.showingRegistration = false;
        this.showingConnection = false;
        this.showingSalon = false;
        this.connected = false;

        this.listUser = [];
        this.listTache = [];
        this.listSalon = [];
        this.listMembre = [];
        this.listMessage = [];
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
        );
        this.tache = new Task(
            0,
            "",
            undefined,
            false
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
        this.affecteForm = this.formBuilder.group({
            user: []
        })
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
        this.chatForm = this.formBuilder.group({
            content: [""]
        });

        this.refreshChat();
    }

    ngOnInit(): void {
        this.userSubscribe = this.userService.subjectList.subscribe(
            (users: User[]) => {
                this.listUser = users;
            }
        );
        this.salonSubscribe = this.salonService.subjectList.subscribe(
            (salons: Salon[]) => {
                this.listSalon = salons;
            }
        );

        this.updateSalon();
    }

    refreshChat() {

        this.getTchat();
        console.log("refresh");
        setTimeout(this.refreshChat, 5000);
    }

    resetSalon() {
        this.listTache = [];
        this.listMembre = [];

        this.creationTache = false;
        this.creationSalon = false;
        this.affecteMembre = false;
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
        this.updateSalon();
        this.resetSalon();
        this.showingSalon = true;

        this.listSalon.forEach(e => {
            if (e.id == id)
                this.salon = e;
        });

        this.listMembre = this.salon?.members;
        this.listTache = this.salon?.tasks;

        this.getTchat();
    }

    getTchat() {
        this.salonService.getTchat(this.salon).then(
            e => {
                this.listMessage = [];
                e?.data.messages.forEach((elem: any) => {
                    this.listMessage.push(new Message(elem[0], elem[1], elem[2], elem[3]));
                });
            }
        );
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
                newSalon.addressEvent.id = e?.data.address.id;

                this.salonService.add(newSalon).then(
                    e => {
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
            undefined,
            false
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
        this.affecteMembre = false;
        this.ajoutMembre = false;
        this.showingRegistration = false;
        this.showingConnection = false;
        this.showingSalon = false;
    }

    getSalonId() {
        return this.salon.id;
    }

    showingMenuDroite() {
        return (this.showingSalon || this.creationTache || this.ajoutMembre || this.affecteMembre);
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
                this.ajoutMembre = true;
            }
        )
    }

    isMyMessage(msg: Message) {
        // @ts-ignore
        return +localStorage.getItem("id") === msg.user.id;
    }

    onSendMessage() {
        const formValue = this.chatForm.value;
        const content = formValue["content"];

        // @ts-ignore
        this.listMembre?.forEach(e => {
            // @ts-ignore
            if (e.user.id === +localStorage.getItem("id")) {
                this.salonService.addMessage(this.salon, e.id, content).then(
                    e => {
                        this.getTchat();
                    }
                );
            }
        });
        formValue["content"] = "";
    }

    getDate(date: Date) {
        return formatDate(date,'dd/MM/yyyy', 'fr');
    }

    canIValidate(tache: Task) {

        if (tache.affectedMember === undefined || tache.affectedMember === null)
            return false;

        // @ts-ignore
        return (tache.affectedMember.user.id === +localStorage.getItem("id") && !tache.done);
    }

    onValidateTask(tache: Task) {
        this.listMembre?.forEach(
            e => {
                // @ts-ignore
                if (e.user.id === +localStorage.getItem("id")) {
                    this.salonService.validerTache(this.salon, e.id, tache).then(
                        e => {
                            this.selectSalon(this.salon.id);
                        }
                    );
                }
            }
        );
    }

    affecterTache(tache: Task) {
        this.tache = tache;
        this.refresh();

        this.affecteMembre = true;
    }

    onAffecterMembre() {
        const formValue = this.affecteForm.value;
        const membreId = +formValue["user"];

        this.salonService.affectMemberToTask(this.salon, membreId, this.tache).then(
            e => {
                this.refresh();
                this.selectSalon(this.salon.id);
            }
        );
    }

    hasToAffect(tashe: Task) {
        return ((tashe.affectedMember === undefined || tashe.affectedMember === null) && this.amIHost() && !tashe.done);
    }
}
