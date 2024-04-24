import { createContext,useState,useContext } from "react";

const UserContext = createContext(null);
export const useUser = () => {
    return useContext(UserContext);
}

export default function UserProvider({component}) {
    const [userInfo, setUserInfo] = useState(null);

    return (
    <UserContext.Provider value={{userInfo,setUserInfo}}>
        {component}
    </UserContext.Provider>
    );
}