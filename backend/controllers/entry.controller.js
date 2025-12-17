import entryModel from "../models/entry.js";

export const entryController = async (req, res) => {
    const userId = req.user.id

    const entries = await entryModel.find({userId}).sort({ createdAt: -1}).limit(3)

    if(!entries){
        res.send("No Previous Reflections.")
    }

    res.json(entries)
}

export const guardianMessage = async (req, res) => {
    const userId = req.user.id

    const latest = await entryModel.findOne({userId}).sort({createdAt: -1})

    if(!latest){
        console.log("Not Able To Get Latest Reflection.")
    }

    let hour = new Date().getHours()
    let type = hour < 16 ? "morning" : "evening"

    let message = ""

    if (type === "morning") {

    // Case 1: Calm + Gentle Encouragement
    if (latest.emotional_state === "Calm" && latest.motivation_style === "Gentle Encouragement") {
        message = "Bom dia. Você não precisa se forçar hoje. Comece com gentileza — um copo de água, uma respiração lenta e uma pequena intenção já são suficientes."
    }

    // Case 2: Overwhelmed + Calm Reassurance
    else if (latest.emotional_state === "Overwhelmed" && latest.motivation_style === "Calm Reassurance") {
        message = "Bom dia. Vamos manter o dia leve e simples. Você pode ir devagar. Comece com água, uma respiração estável e apenas uma tarefa fácil."
    }

    // Case 3: Calm + Accountability Forward
    else if (latest.emotional_state === "Calm" && latest.motivation_style === "Accountability Forward") {
        message = "Bom dia. Hoje é um bom dia para agir com intenção. Comece pelo básico — água, um plano claro e uma ação focada."
    }

    // Fallback (important)
    else {
        message = "Bom dia. Tire um momento para se conectar com o corpo. Uma respiração, um gole de água, um passo adiante."
    }
    }

    if (type === "evening") {

    // Case 2 Evening: Overwhelmed + Calm Reassurance
    if (latest.emotional_state === "Overwhelmed" && latest.motivation_style === "Calm Reassurance") {
        message = "Você fez o suficiente por hoje. Agora é seguro descansar. Deixe o dia se encerrar com suavidade — desacelere, respire e solte o que está carregando."
    }

    // Case 3 Evening: Calm + Accountability Forward
    else if (latest.emotional_state ==="Calm" && latest.motivation_style === "Accountability Forward") {
        message = "O dia chegou ao fim. Reconheça o que você conseguiu fazer. Amanhã pode esperar — agora, o descanso vem primeiro."
    }

    // General fallback
    else {
        message = "O dia está terminando. Você esteve presente da forma que pôde. Permita-se relaxar e entrar no descanso."
    }
    }

    console.log(latest.emotional_state)
    const motivation_style = latest.motivation_style
    res.json({message, motivation_style, type})
}