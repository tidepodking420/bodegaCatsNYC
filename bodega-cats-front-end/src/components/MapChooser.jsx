import AdminMap from './AdminMap.jsx';
import UserMap from './UserMap.jsx'


// role is a int
// 0 for admin (me), 1 for user
export default function MapChooser({role}){
    return role === 0 ? <AdminMap/> : <UserMap/>
}