import React from "react";
import config from "../config";
import {useDispatch, useSelector} from "react-redux";
import {setToolbarTitle as setGlobalToolbarTitle} from "../redux/actions"

const useToolbarTitle = (title: string = "") => {
    const [toolbarTitle, setToolbarTitle] = React.useState(title);
    const dispatch = useDispatch();
    const globalToolbarTitle = useSelector((state: any) => state.main.toolbarTitle);

    React.useEffect(() => {
        if (title.length > 0) {
            dispatch(setGlobalToolbarTitle(title));
            setToolbarTitle(title);
            document.title = toolbarTitle + " - " + config.main.appName;
        } else {
            setToolbarTitle(globalToolbarTitle);
            document.title = toolbarTitle + " - " + config.main.appName;
        }
    }, [dispatch, globalToolbarTitle, title, toolbarTitle]);

    return toolbarTitle;
};

export default useToolbarTitle;