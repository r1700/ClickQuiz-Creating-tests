import { useEffect } from "react";
import { matchPath, useLocation } from "react-router-dom";

export default function usePageTitle() {
    const location = useLocation();

    useEffect(() => {
        const routeTitles = {
            "/": "דף הבית |   ClickQuiz",
            "/home": "דף הבית |   ClickQuiz",
            "/create-exam": "צור מבחן חדש | ClickQuiz",
            "/get-my-exams": "המבחנים שלי | ClickQuiz",
            // "/edit-exam/:examId": "עריכת מבחן | ClickQuiz",
            // '/export-exam/:id': "ייצוא מבחן | ClickQuiz",
            "/login": "התחברות | ClickQuiz",
            "/register": "הרשמה | ClickQuiz",
            "/forget-password": "שכחתי סיסמה | ClickQuiz",
            "/reset-password": "איפוס סיסמה | ClickQuiz",
            "/profile": "הפרופיל שלי | ClickQuiz",
        };
        let title = routeTitles[location.pathname];

        if (matchPath("/export-exam/:id", location.pathname)) {
            title = "ייצוא מבחן | ClickQuiz";
        }

        if (matchPath("/edit-exam/:examId", location.pathname)) {
            title = "עריכת מבחן | ClickQuiz";
        }

        document.title = title || "ClickQuiz";
    }, [location]);
}