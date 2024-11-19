import { Permission } from "./permission.model";

export class Role {


    constructor(

        public id: number,
        public name: string,
        public permissions: []

    ) {

    }

}