import { nanoid } from "nanoid";
import { BeforeInsert, PrimaryColumn } from "typeorm";

export class AbstractEntity<T>{
    @PrimaryColumn()
    id: string;


    constructor(entity: Partial<T>){
        Object.assign(this,entity);
    }

    @BeforeInsert()
    protected beforeInsert(){
        this.id = this.getId();
    }
    
    protected getId(): string{
        return this.id || nanoid();
    }
}