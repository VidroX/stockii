import React, { useEffect } from "react";
import { userLogin } from "../redux/actions";
import { connect } from "react-redux";
import { useTranslation } from 'react-i18next';
import { Grid, makeStyles, Paper, TextField, Typography } from "@material-ui/core";
import clsx from "clsx";
import config from "../config";
import { isMobile } from "react-device-detect";
import LoadingSubmitButton from "../components/loadingSubmitButton";
import Cookies from "js-cookie";

const LoginPage: React.FC = (props: any) => {
    const classes = useStyles();
    const { t } = useTranslation();

    const [emailField, setEmailField] = React.useState({
        error: false,
        errorText: "",
        value: ""
    });
    const [passwordField, setPasswordField] = React.useState({
        error: false,
        errorText: "",
        value: ""
    });
    const [loading, setLoading] = React.useState(false);

    useEffect(() => {
        if(!props.authProgress) {
            if(props.authData != null) {
                if (parseInt(props.authData.status_code || props.authData.status) === 2) {
                    let userData = props.authData.data.user;

                    if (userData != null) {
                        let token = null;
                        if(config.api.same_site) {
                            token = Cookies.get('token');
                        } else {
                            token = props.authData.data.token;
                        }

                        console.log(props.authData);

                        if (token) {
                            userData = {
                                auth_token: token,
                                ...props.authData.data.user
                            };
                        }

                        Cookies.set(
                            'user_data',
                            JSON.stringify(userData),
                            {
                                expires: new Date(props.authData.data.token_expiry),
                                secure: document.location.protocol === 'https:',
                                sameSite: 'strict'
                            }
                        );

                        window.location.reload();
                    }
                } else {
                    setEmailField({
                        error: true,
                        errorText: t('auth.incorrectFieldData'),
                        value: emailField.value
                    });
                    setPasswordField({
                        error: true,
                        errorText: t('auth.incorrectFieldData'),
                        value: passwordField.value
                    });
                }
            }

            setLoading(false);
        }
    }, [emailField.value, passwordField.value, props.authData, props.authProgress, props.userData, t]);

    const onFormSubmit = (e: any) => {
        e.preventDefault();
        setEmailField({
            error: false,
            errorText: "",
            value: emailField.value
        });
        setPasswordField({
            error: false,
            errorText: "",
            value: passwordField.value
        });

        if (emailField.value.length < 1) {
            setEmailField({
                error: true,
                errorText: t('common.fieldEmpty'),
                value: emailField.value
            });
        }
        if (passwordField.value.length < 1) {
            setPasswordField({
                error: true,
                errorText: t('common.fieldEmpty'),
                value: passwordField.value
            });
        }
        if (passwordField.value.length < 6 && passwordField.value.length > 0) {
            setPasswordField({
                error: true,
                errorText: t('auth.smallPassword'),
                value: passwordField.value
            });
        }

        if(emailField.value.length > 0 && passwordField.value.length > 5) {
            setLoading(true);
            props.userLogin(emailField.value, passwordField.value);

            setTimeout(() => {
                setLoading(false);
            }, config.main.connectionTimeout)
        }
    };

    return (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
            className={classes.grid}
        >
            <Typography variant="h6" className={clsx(classes.header, classes.root)}>
                {t('auth.logInto')} {config.main.appName}
            </Typography>
            <Paper className={classes.root}>
                <form
                    method="post"
                    className={classes.form}
                    onSubmit={onFormSubmit}
                >
                    <TextField
                        required
                        autoFocus
                        error={emailField.error}
                        value={emailField.value}
                        onChange={(e) => {
                            setEmailField({
                                error: false,
                                errorText: "",
                                value: e.target.value
                            });
                        }}
                        label="E-Mail"
                        type="email"
                        helperText={emailField.errorText}
                        margin={isMobile ? "normal" : "dense"}
                        variant="outlined"
                    />
                    <TextField
                        required
                        error={passwordField.error}
                        value={passwordField.value}
                        onChange={(e) => {
                            setPasswordField({
                                error: false,
                                errorText: "",
                                value: e.target.value
                            });
                        }}
                        label={t('auth.password')}
                        type="password"
                        helperText={passwordField.errorText}
                        margin={isMobile ? "normal" : "dense"}
                        variant="outlined"
                    />
                    <LoadingSubmitButton
                        title={t('auth.logIn')}
                        loadingStatus={loading}
                        className={classes.button}
                        onButtonClick={() => {}}
                    />
                </form>
            </Paper>
        </Grid>
    );
};

const mapStateToProps = (state: any) => {
    return {
        userData: state.main.userData,
        authProgress: state.main.authProgress,
        authData: state.main.authData
    };
};

const mapDispatchToProps = {
    userLogin
};

const useStyles = makeStyles(theme => ({
    grid: {
        minHeight: '100vh',
        [theme.breakpoints.down('xs')]: {
            minHeight: 'auto'
        }
    },
    button: {
        display: 'flex',
        flexGrow: 0,
        width: 150,
        marginLeft: 'auto',
        marginRight: 'auto',
        alignSelf: 'center',
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(1),
        [theme.breakpoints.down('xs')]: {
            width: 'auto',
            marginLeft: 0,
            marginRight: 0,
            flexGrow: 1
        },
        color: "#FFFFFF"
    },
    header: {
        textAlign: 'center'
    },
    input: {
        padding: '18px 12px'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
        wordBreak: 'break-all'
    },
    root: {
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(2),
        flexWrap: 'wrap',
        wordBreak: 'break-all',
        minWidth: 350,
        marginTop: 0,
        [theme.breakpoints.down('xs')]: {
            minWidth: 'auto',
            flexGrow: 1,
            alignSelf: 'stretch',
            marginTop: 16
        }
    }
}));

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);