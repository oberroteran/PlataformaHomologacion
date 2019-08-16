import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ApiService } from '../../../../shared/services/api.service';

@Injectable()
export class Step05Service {
    constructor( private api: ApiService) {}

getCanalTipoPago(channel: string, settings: string)
{   const endpoint = 'codechannel';
    const action = 'obtenertipopagocanal';
    const url = `${endpoint}/${action}/${channel}/${settings}`;
    return this.api.get(url);   
}
}