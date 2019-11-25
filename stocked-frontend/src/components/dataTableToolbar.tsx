import React from "react";
import {IconButton, Tooltip, withStyles} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import AddIcon from "@material-ui/icons/Add";
import PropTypes from "prop-types";
import {useSelector} from "react-redux";

const DataTableToolbar: React.FC<{onAddButtonClick: any}> = (props: any) => {
    const { t } = useTranslation("table");
    const { classes, onAddButtonClick } = props;
    const user = useSelector((state: any) => state.main.userData);

    if(user.is_superuser) {
        return (
            <React.Fragment>
                <Tooltip title={t('toolbar.add')}>
                    <IconButton className={classes.iconButton} onClick={onAddButtonClick}>
                        <AddIcon className={classes.deleteIcon}/>
                    </IconButton>
                </Tooltip>
            </React.Fragment>
        );
    } else {
        return null;
    }
};

const defaultToolbarStyles = {
    iconButton: {
    },
};

DataTableToolbar.propTypes = {
    onAddButtonClick: PropTypes.func.isRequired
};

DataTableToolbar.defaultProps = {
    onAddButtonClick: () => {}
};

export default withStyles(defaultToolbarStyles, { name: "CustomToolbar" })(DataTableToolbar);