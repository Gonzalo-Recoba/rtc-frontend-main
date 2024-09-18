import styles from "../../styles/panelAdmin.module.css"
import CanchasTable from './CanchasTable'
import { useContext, useState } from "react";
import { UserContext } from "../../context/userContext";
import UsersTable from "./UsersTable";
import ErrorPage from "../../Pages/ErrorPage";
import CreateCanchas from "./CreateCanchas";
import EditCanchas from "./EditCanchas";



const PanelAdmin = () => {
  const { state } = useContext(UserContext);
  const admin = state.admin;
  const operator = state.operator

  const [showCourt, setShowCourt] = useState(true)
  const [ShowFormCreate, setShowFormCreate] = useState(false)
  const [showFormEdit, setShowFormEdit] = useState(false)
  return (
    <>
      {(admin || operator) ?
        <div>
          <h2 className={styles.title}>Panel de control</h2>
          <div className={styles.buttonContainer}>
            <button className={styles.button} onClick={()=>{setShowCourt(true)}} style={showCourt ? {backgroundColor:"#007F6D"} : {backgroundColor:"#00A991"}}>Ver canchas</button>
            {admin && <button className={styles.button} onClick={()=>{setShowCourt(false)}} style={!showCourt ? {backgroundColor:"#007F6D"} : {backgroundColor:"#00A991"}}>Ver Usuarios</button>}     
         </div>
          {showCourt ? 
            <>
              {ShowFormCreate ?
                <>
                  <CreateCanchas setShowFormCreate={setShowFormCreate}/>
                </>
              :
              <>
                 {showFormEdit ? 
                      <EditCanchas setShowFormEdit={setShowFormEdit}/>
                  : 
                  <>
                    <button type="button" onClick={()=> setShowFormCreate(true)} className={styles.button}>Crear nueva cancha</button>
                    <CanchasTable setShowFormEdit={setShowFormEdit}/>
                  </>
                 }
              </>
              }
            </>
          :
          <>
            {admin && <UsersTable/> }
           </>
          }
        </div>
      :
      <ErrorPage/>
      }
    </>
  )
}

export default PanelAdmin