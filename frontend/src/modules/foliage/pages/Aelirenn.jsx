import Card from "@shared/components/ui/Card/Card.jsx";
import React from "react";
import Paragraph from "@shared/components/ui/Paragraph/Paragraph.jsx";

function Aelirenn() {
    return (
        <>
            <div className="basis-4/12 2xl:basis-3/12 h-full relative z-10 ml-24">
                <Card>
                    <Paragraph className={"italic"}>
                        Цей інструмент дозволить імпортувати рослинність у світ "Відьмака" з підтримкою створення біомів та плавного переходу між ними.
                        <br/> <br/>
                        Завдяки цій функції ви зможете наповнити свої ландшафти реалістичною вегетацією та створити природні межі між різними типами середовищ.
                        <br/> <br/>
                        Функція з'явиться вже скоро — залишайтесь з нами!
                    </Paragraph>
                </Card>
            </div>
            <div className="basis-8/12 2xl:basis-9/12 2xl:mr-24 flex justify-center">
                <div className="gwent-map">
                </div>
            </div>
        </>

    );
}

export default Aelirenn;