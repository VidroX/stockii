import React, {useEffect} from "react";
import {useTranslation} from "react-i18next";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    makeStyles,
    TextField,
    Theme,
    useMediaQuery,
    useTheme
} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import config from "../../config";
import {register, setGlobalLoading, setSnackbar, showSnackbar} from "../../redux/actions";
import {KeyboardDatePicker} from "@material-ui/pickers";
import {MaterialUiPickersDate} from "@material-ui/pickers/typings/date";
import moment from "moment";
import PhoneMask from "../phoneMask";

interface UsersAddInterface {
    open: boolean,
    onOpen?(): void,
    onClose?(shouldRefresh: boolean): void
}

interface BirthdayInterface {
    error: boolean,
    errorText: string,
    value: string | null
}

const UsersAdd: React.FC<UsersAddInterface> = (props: UsersAddInterface) => {
    const {
        onOpen,
        onClose,
        open
    } = props;

    const { t } = useTranslation();

    const theme = useTheme();
    const classes = useStyles();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const todayDate = moment().format("DD.MM.YYYY").toString();

    const [lastName, setLastName] = React.useState({
        error: false,
        errorText: "",
        value: ""
    });
    const [firstName, setFirstName] = React.useState({
        error: false,
        errorText: "",
        value: ""
    });
    const [patronymic, setPatronymic] = React.useState({
        error: false,
        errorText: "",
        value: ""
    });
    const [email, setEmail] = React.useState({
        error: false,
        errorText: "",
        value: ""
    });
    const [password, setPassword] = React.useState({
        error: false,
        errorText: "",
        value: ""
    });
    const [repeatPassword, setRepeatPassword] = React.useState({
        error: false,
        errorText: "",
        value: ""
    });
    const [birthday, setBirthday] = React.useState<BirthdayInterface>({
        error: false,
        errorText: "",
        value: todayDate
    });
    const [mobilePhone, setMobilePhone] = React.useState({
        error: false,
        errorText: "",
        value: "",
        clearValue: ""
    });

    const [loading, setLoading] = React.useState<boolean>(false);

    const dispatch = useDispatch();
    const userCreateProgress = useSelector((state: any) => state.main.userCreateProgress);
    const userCreateData = useSelector((state: any) => state.main.userCreateData);

    const clearFields = (clearValues: boolean = false) => {
        setLastName({
           error: false,
           errorText: "",
           value: clearValues ? "" : lastName.value
        });
        setFirstName({
            error: false,
            errorText: "",
            value: clearValues ? "" : firstName.value
        });
        setPatronymic({
            error: false,
            errorText: "",
            value: clearValues ? "" : patronymic.value
        });
        setEmail({
            error: false,
            errorText: "",
            value: clearValues ? "" : email.value
        });
        setPassword({
            error: false,
            errorText: "",
            value: clearValues ? "" : password.value
        });
        setRepeatPassword({
            error: false,
            errorText: "",
            value: clearValues ? "" : repeatPassword.value
        });
        setBirthday({
            error: false,
            errorText: "",
            value: clearValues ? todayDate : birthday.value
        });
        setMobilePhone({
            error: false,
            errorText: "",
            value: clearValues ? "" : mobilePhone.value,
            clearValue: clearValues ? "" : mobilePhone.clearValue
        });
    };

    useEffect(() => {
        if (!open) {
            setLastName({
                error: false,
                errorText: "",
                value: ""
            });
            setFirstName({
                error: false,
                errorText: "",
                value: ""
            });
            setPatronymic({
                error: false,
                errorText: "",
                value: ""
            });
            setEmail({
                error: false,
                errorText: "",
                value: ""
            });
            setPassword({
                error: false,
                errorText: "",
                value: ""
            });
            setRepeatPassword({
                error: false,
                errorText: "",
                value: ""
            });
            setBirthday({
                error: false,
                errorText: "",
                value: todayDate
            });
            setMobilePhone({
                error: false,
                errorText: "",
                value: "",
                clearValue: ""
            });
        }
    }, [open, todayDate]);

    useEffect(() => {
        if (loading && !userCreateProgress && userCreateData != null) {
            if (userCreateData.status_code === 11 && userCreateData.data.email != null) {
                setEmail({
                    error: true,
                    errorText: t('users.userEmailExists'),
                    value: email.value
                });
                setLoading(false);
                dispatch(setGlobalLoading(false));
                return;
            }
            if (userCreateData.status_code === 11 && userCreateData.data.mobile_phone != null) {
                setMobilePhone({
                    error: true,
                    errorText: t('users.userPhoneExists'),
                    value: mobilePhone.value,
                    clearValue: mobilePhone.clearValue
                });
                setLoading(false);
                dispatch(setGlobalLoading(false));
                return;
            }

            setLoading(false);
            dispatch(setGlobalLoading(false));
            dispatch(setSnackbar(t('users.userCreated'), 'success'));
            dispatch(showSnackbar(true));

            if(onClose) {
                onClose(true);
            }
        }
    }, [dispatch, loading, mobilePhone, email, onClose, userCreateProgress, userCreateData, t]);

    const onSubmit = (e: any) => {
        e.preventDefault();
        clearFields();

        if (firstName.value.length < 1) {
            setFirstName({
                error: true,
                errorText: t('common.fieldEmpty'),
                value: firstName.value
            });
        }
        if (lastName.value.length < 1) {
            setLastName({
                error: true,
                errorText: t('common.fieldEmpty'),
                value: lastName.value
            });
        }
        if (patronymic.value.length < 1) {
            setPatronymic({
                error: true,
                errorText: t('common.fieldEmpty'),
                value: patronymic.value
            });
        }
        if (email.value.length < 1) {
            setEmail({
                error: true,
                errorText: t('common.fieldEmpty'),
                value: email.value
            });
        }
        if (password.value.length < 1) {
            setPassword({
                error: true,
                errorText: t('common.fieldEmpty'),
                value: password.value
            });
        }
        if (repeatPassword.value.length < 1) {
            setRepeatPassword({
                error: true,
                errorText: t('common.fieldEmpty'),
                value: repeatPassword.value
            });
        }
        if (birthday.value != null && birthday.value.length < 1) {
            setBirthday({
                error: true,
                errorText: t('common.fieldEmpty'),
                value: birthday.value
            });
        }
        if (mobilePhone.value.length < 1) {
            setMobilePhone({
                error: true,
                errorText: t('common.fieldEmpty'),
                value: mobilePhone.value,
                clearValue: mobilePhone.clearValue
            });
        }
        if (password.value.length < 6) {
            setPassword({
                error: true,
                errorText: t('users.passwordToSmall'),
                value: password.value
            });
        }
        if (password.value !== repeatPassword.value) {
            setPassword({
                error: true,
                errorText: t('users.passwordsDNotMatch'),
                value: password.value
            });
            setRepeatPassword({
                error: true,
                errorText: t('users.passwordsDNotMatch'),
                value: repeatPassword.value
            });
        }
        if (birthday.value != null && birthday.value.length !== 10) {
            setBirthday({
                error: true,
                errorText: t('users.incorrectData'),
                value: birthday.value
            });
        }
        if (mobilePhone.value.length !== 13) {
            setBirthday({
                error: true,
                errorText: t('users.incorrectMobilePhone'),
                value: birthday.value
            });
        }

        if(isEverythingCompleted(true) && birthday.value != null) {
            setLoading(true);
            dispatch(setGlobalLoading(true));

            dispatch(register(email.value, password.value, mobilePhone.value, lastName.value, firstName.value, patronymic.value, moment(birthday.value, "DD.MM.YYYY").format("YYYY-MM-DD").toString()));

            setTimeout(() => {
                setLoading(false);
            }, config.main.connectionTimeout)
        }
    };

    const isEverythingCompleted = (checkPassword = false): boolean => {
        if (!checkPassword) {
            return  (lastName.value.length > 0 && !lastName.error) &&
                    (firstName.value.length > 0 && !firstName.error) &&
                    (patronymic.value.length > 0 && !patronymic.error) &&
                    (email.value.length > 0 && !email.error) &&
                    (password.value.length > 5 && !password.error) &&
                    (birthday.value != null && birthday.value.length === 10 && !birthday.error) &&
                    (mobilePhone.value != null && mobilePhone.value.length === 13 && !mobilePhone.error);
        } else {
            return  (lastName.value.length > 0 && !lastName.error) &&
                    (firstName.value.length > 0 && !firstName.error) &&
                    (patronymic.value.length > 0 && !patronymic.error) &&
                    (email.value.length > 0 && !email.error) &&
                    (password.value.length > 5 && !password.error) &&
                    (repeatPassword.value.length > 5 && !repeatPassword.error) &&
                    (password.value === repeatPassword.value) &&
                    (birthday.value != null && birthday.value.length === 10 && !birthday.error) &&
                    (mobilePhone.value != null && mobilePhone.value.length === 13 && !mobilePhone.error);
        }
    };

    return (
        <Dialog
            fullScreen={fullScreen}
            open={open}
            onClose={() => onClose != null ? onClose(false) : {}}
            onBackdropClick={() => onClose != null ? onClose(false) : {}}
            onEnter={onOpen}
            aria-labelledby="form-dialog-title"
            scroll="body"
        >
            <form className={classes.form} onSubmit={onSubmit} method="post">
                <DialogTitle>{ t('users.addUser') }</DialogTitle>
                <DialogContent className={classes.content}>
                    <TextField
                        className={classes.textField}
                        label={t('users.lastName')}
                        variant="outlined"
                        value={lastName.value}
                        required
                        margin={fullScreen ? "normal" : "dense"}
                        error={lastName.error}
                        helperText={lastName.errorText}
                        onChange={(e) => {
                            setLastName({
                                error: false,
                                errorText: "",
                                value: e.target.value
                            });
                        }}
                    />
                    <TextField
                        className={classes.textField}
                        label={t('users.firstName')}
                        variant="outlined"
                        value={firstName.value}
                        required
                        margin={fullScreen ? "normal" : "dense"}
                        error={firstName.error}
                        helperText={firstName.errorText}
                        onChange={(e) => {
                            setFirstName({
                                error: false,
                                errorText: "",
                                value: e.target.value
                            });
                        }}
                    />
                    <TextField
                        className={classes.textField}
                        label={t('users.patronymic')}
                        variant="outlined"
                        value={patronymic.value}
                        required
                        margin={fullScreen ? "normal" : "dense"}
                        error={patronymic.error}
                        helperText={patronymic.errorText}
                        onChange={(e) => {
                            setPatronymic({
                                error: false,
                                errorText: "",
                                value: e.target.value
                            });
                        }}
                    />
                    <TextField
                        className={classes.textField}
                        label={t('main.email')}
                        variant="outlined"
                        value={email.value}
                        required
                        type="email"
                        margin={fullScreen ? "normal" : "dense"}
                        error={email.error}
                        helperText={email.errorText}
                        onChange={(e) => {
                            setEmail({
                                error: false,
                                errorText: "",
                                value: e.target.value
                            });
                        }}
                    />
                    <KeyboardDatePicker
                        className={classes.textField}
                        margin={fullScreen ? "normal" : "dense"}
                        id="date-picker-dialog"
                        label={t('users.birthday')}
                        format="DD.MM.YYYY"
                        variant="dialog"
                        inputVariant="outlined"
                        required
                        maxDate={new Date()}
                        minDate={moment().subtract(130, 'years').toDate()}
                        value={birthday.value != null ? moment(birthday.value, "DD.MM.YYYY").toDate() : null}
                        error={birthday.error}
                        helperText={birthday.errorText}
                        onChange={(date: MaterialUiPickersDate | null) => {
                            setBirthday({
                                error: false,
                                errorText: "",
                                value: date != null ? date.format("DD.MM.YYYY").toString() : null
                            });
                        }}
                        KeyboardButtonProps={{
                            'aria-label': t('users.selectDate'),
                        }}
                    />
                    <TextField
                        className={classes.textField}
                        label={t('users.mobilePhone')}
                        variant="outlined"
                        value={mobilePhone.clearValue}
                        required
                        margin={fullScreen ? "normal" : "dense"}
                        error={mobilePhone.error}
                        helperText={mobilePhone.errorText}
                        onChange={(e) => {
                            setMobilePhone({
                                error: false,
                                errorText: "",
                                value: e.target.value.replace(/[_()\-\s]/gi, ''),
                                clearValue: e.target.value
                            });
                        }}
                        InputProps={{
                            inputComponent: PhoneMask as any,
                        }}
                    />
                    <TextField
                        className={classes.textField}
                        label={t('auth.password')}
                        variant="outlined"
                        value={password.value}
                        required
                        type="password"
                        margin={fullScreen ? "normal" : "dense"}
                        error={password.error}
                        helperText={password.errorText}
                        onChange={(e) => {
                            setPassword({
                                error: false,
                                errorText: "",
                                value: e.target.value
                            });
                        }}
                    />
                    <TextField
                        className={classes.textField}
                        label={t('users.repeatPassword')}
                        variant="outlined"
                        value={repeatPassword.value}
                        required
                        type="password"
                        margin={fullScreen ? "normal" : "dense"}
                        error={repeatPassword.error}
                        helperText={repeatPassword.errorText}
                        onChange={(e) => {
                            setRepeatPassword({
                                error: false,
                                errorText: "",
                                value: e.target.value
                            });
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={() => onClose != null ? onClose(false) : {}} color="primary">
                        { t('main.cancel') }
                    </Button>
                    <Button disabled={!isEverythingCompleted()} type="submit" color="primary">
                        { t('main.add') }
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

const useStyles = makeStyles((theme: Theme) => ({
    content: {
        [theme.breakpoints.down('sm')]: {
            flex: 1
        }
    },
    form: {
        [theme.breakpoints.down('sm')]: {
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            height: '100%'
        }
    },
    textField: {
        display: 'flex',
        marginBottom: theme.spacing(2),
        width: 300,
        [theme.breakpoints.down('sm')]: {
            width: 'auto',
            flex: 1
        }
    }
}));

export default UsersAdd;
