import style from '../styles/loading.module.css'

const Loading = () => {
  return (
      <div className={style.textLoading}>
      <h3>Loading</h3>
      <div className={style.spinner}></div>
    </div>

  )
}

export default Loading
