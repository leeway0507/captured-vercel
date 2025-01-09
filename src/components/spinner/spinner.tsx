import styles from './spinner.module.css'

function Spinner() {
    return (
        <div className="flex-center absolute inset-0">
            <div className={`${styles.loader}`} />
        </div>
    )
}

export default Spinner
