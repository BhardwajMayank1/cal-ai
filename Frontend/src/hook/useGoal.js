import { useEffect ,useState } from "react";
import { setGoals ,getGoals ,updateGoals } from "../services/goalapi";

export const useGoals=()=>{

const[goals ,setGoal] = useState('')
const [loading ,setLoading]= useState('')

useEffect(()=>{
    const fetchGoals =async()=>{
        try {
            const data = await getGoals();
            console.log('GET GOALS RESPONSE:', JSON.stringify(data, null, 2))
            setGoal(data)
        } catch (err) {
            setGoal(null)
            console.log(err)
            }finally{
                setLoading(false)
            }
  }
    fetchGoals()
},[])

const saveGoals=async({calories,protein ,carbs,fat})=>{
    const data =goals? await updateGoals({calories,protein,carbs,fat})
    :await setGoals({calories,protein,carbs,fat})
    setGoal(data)
    return data
}
return{goals ,loading,saveGoals}


}

