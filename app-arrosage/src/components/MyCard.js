import styled from "styled-components";
import {Card} from 'semantic-ui-react';

const MyCard = styled(Card)`
        cursor: pointer;
        &:hover {
        transform: scale(1.05);
        transition: all 0.3s;}`;

export default MyCard;