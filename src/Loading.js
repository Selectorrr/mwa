import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'

// Во время загрузки важно не использовать внешние стили. Прописываем свои
const styles = {
    div: {
        width: '20%',
        margin: 'auto',
        transition: 'margin 1s',
        backgroundColor: 'lightgreen',
        color: 'white',
        cursor: 'pointer',
        borderRadius: '3px'
    }
}

export default function Loading(props) {
    if (props.error) {
        // Если при загрузке произошла ошибка (после раздела PWA станет понятнее), то
        // выводим блок, призывающий выполнить принудительную перезагрузку страницы
        return <div style={styles.div} onClick={() => window.location.reload(true)} align="center">
            <h3>
                Please, click here or reload the page. New content is ready.
            </h3>
        </div>
    } else if (props.pastDelay) {
        // Если время загрузки больше 300мс, выводим грузящийся круг
        return <CircularProgress color="primary"/>
    } else {
        // Иначе не выводим Loading вовсе
        return null
    }
}