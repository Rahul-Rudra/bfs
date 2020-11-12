import axios from 'axios';

import {globalVar} from '../config';

export const instance = axios.create({
    baseURL: globalVar.base_url,
    headers: {
        'Content-Type': 'application/json',
    },
});
