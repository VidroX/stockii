import React from "react";
import {IconButton, Tooltip, withStyles} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import AddIcon from "@material-ui/icons/Add";
import PropTypes from "prop-types";

const DataTableToolbar: React.FC<{onAddButtonClick: any}> = (props: any) => {
    const { t } = useTranslation("table");
    const { classes, onAddButtonClick } = props;

    return (
        <React.Fragment>
            <Tooltip title={t('toolbar.add')}>
                <IconButton className={classes.iconButton} onClick={onAddButtonClick}>
                    <AddIcon className={classes.deleteIcon} />
                </IconButton>
            </Tooltip>
        </React.Fragment>
    );
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