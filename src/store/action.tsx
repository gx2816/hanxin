
import * as types from "./action-types";

export default{
    setLoading(bol:boolean){
        return { type: types.SETLOADING, bol: bol}
    }
}