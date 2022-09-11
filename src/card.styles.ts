import { css } from "lit";

export default css`
    .c-card {
        background-color: white;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 24px;
        gap: 8px;
        max-width: 400px;
    }

    .c-card__title,
    .c-card__content {
        color: black;
        font-family: 'Poppins', sans-serif;
        font-size: 20px;
        color: #71727A;
        line-height: 1.5;
    }

    .c-card__title {
        margin: 0;
        display: flex;
        justify-content: space-between;
        width: 100%;
        font-weight: bold;
        font-size: 34px;
        color: #1F2024;
        line-height: 1;
    }
`;