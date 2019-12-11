import React from "react";
import {Button, IconButton, makeStyles, Menu, MenuItem} from "@material-ui/core";
import { FlagIcon } from "react-flag-kit";
import { useTranslation } from "react-i18next";
import { LanguageSelectorInterface } from "../intefaces";
import Cookies from "js-cookie";
import moment from "moment";

const LanguageSelector: React.FC<LanguageSelectorInterface> = (props: LanguageSelectorInterface) => {
    const { type } = props;

    const [anchorLanguageEl, setAnchorLanguageEl] = React.useState(null);
    const isLanguageMenuOpened = Boolean(anchorLanguageEl);
    const { t, i18n } = useTranslation();

    const classes = useStyles();

    const handleClose = () => {
        setAnchorLanguageEl(null);
    };

    const handleSelectLanguageMenu = (event: any) => {
        setAnchorLanguageEl(event.currentTarget);
    };

    const getLanguageFlag = () => {
        if (i18n.language.includes("en")) {
            return <FlagIcon code="GB" />;
        } else {
            return <FlagIcon code="UA" />;
        }
    };

    const changeLanguage = (language: string) => {
        i18n.changeLanguage(language).then(() => {
            setAnchorLanguageEl(null);

            document.documentElement.lang = i18n.language;

            Cookies.set(
                'language',
                i18n.language,
                {
                    expires: moment().add(1, 'year').toDate(),
                    secure: document.location.protocol === 'https:',
                    sameSite: 'lax'
                }
            );
        });
    };

    const renderButton = () => {
        if (type === 'IconButton') {
            return <IconButton
                        aria-label="Language select"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleSelectLanguageMenu}
                        color="inherit"
                    >
                        {getLanguageFlag()}
                    </IconButton>;
        } else {
            return <Button
                        aria-label="Language select"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleSelectLanguageMenu}
                        color="inherit"
                    >
                        {getLanguageFlag()}
                    </Button>;
        }
    };

    return (
        <div>
            { renderButton() }
            <Menu
                id="menu-appbar"
                anchorEl={anchorLanguageEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={isLanguageMenuOpened}
                onClose={handleClose}
            >
                <MenuItem selected={i18n.language.includes("en")} onClick={() => changeLanguage('en')}>
                    <FlagIcon className={classes.flagIcon} code="GB" /> {t('languages.en')}
                </MenuItem>
                <MenuItem selected={i18n.language.includes("uk")} onClick={() => changeLanguage('uk')}>
                    <FlagIcon className={classes.flagIcon} code="UA" /> {t('languages.uk')}
                </MenuItem>
            </Menu>
        </div>
    );
};

const useStyles = makeStyles(theme => ({
    flagIcon: {
        marginRight: 8
    }
}));

export default LanguageSelector;
