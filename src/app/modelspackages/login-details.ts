export class LoginDetail {
    constructor(public email: string, 
                public password : string,
                public errorMessage : string,
                public termsChecked : boolean,
                public loading : string){

    }    
}