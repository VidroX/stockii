import React from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from "@material-ui/core";
import {useTranslation} from "react-i18next";

interface StockedModalInterface {
    title: string;
    contentText: string;
    open: boolean;
    form: boolean;
    actionOk?: string;
    actionCancel?: string;
    contentBody?: React.ReactNode;
    onSubmit?(e: React.FormEvent): void;
    onOpen?(): void;
    onClose?(): void;
}

const StockedModal: React.FC<StockedModalInterface> = (props: StockedModalInterface) => {
    const {
        title,
        contentText,
        onOpen,
        onClose,
        actionOk,
        actionCancel,
        onSubmit,
        open,
        contentBody,
        form
    } = props;
    const { t } = useTranslation();

    const renderButtons = () => {
        if(form) {
            return (
                <DialogActions>
                    <Button onClick={onClose} color="primary">
                        { actionCancel != null ? actionCancel : t('main.cancel') }
                    </Button>
                    <Button type="submit" color="primary">
                        { actionOk != null ? actionOk : t('main.OK') }
                    </Button>
                </DialogActions>
            );
        } else {
            return (
                <DialogActions>
                    <Button onClick={onClose} color="primary">
                        { actionCancel != null ? actionCancel : t('main.cancel') }
                    </Button>
                    <Button onClick={onSubmit} color="primary">
                        { actionOk != null ? actionOk : t('main.OK') }
                    </Button>
                </DialogActions>
            );
        }
    };

    const renderModal = () => {
        if (form) {
            return (
                <form onSubmit={onSubmit} method="post">
                    <DialogTitle id="form-dialog-title">{ title }</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            { contentText }
                        </DialogContentText>
                        { contentBody }
                    </DialogContent>
                    { renderButtons() }
                </form>
            );
        }else {
            return (
                <React.Fragment>
                    <DialogTitle id="form-dialog-title">{ title }</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            { contentText }
                        </DialogContentText>
                        { contentBody }
                    </DialogContent>
                    { renderButtons() }
                </React.Fragment>
            );
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            onBackdropClick={onClose}
            onEnter={onOpen}
            aria-labelledby="form-dialog-title"
            scroll="body"
        >
            { renderModal() }
        </Dialog>
    );
};

export default StockedModal;