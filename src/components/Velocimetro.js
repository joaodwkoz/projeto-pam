import { useEffect, useRef } from "react";
import { sendNotification } from "../services/notificationService";

const VelocimetroIMC = ({ imc, width = 100, height = 100 }) => {
  const notified = useRef(""); 
  useEffect(() => {
    let faixa = "";

    if (imc < 18.5) faixa = "Abaixo do peso";
    else if (imc < 25) faixa = "Peso normal";
    else if (imc < 30) faixa = "Sobrepeso";
    else if (imc < 35) faixa = "Obesidade grau I";
    else faixa = "Obesidade grau II/III";

   
    if (faixa !== notified.current) {
      sendNotification("IMC Atual", `Seu IMC está em: ${faixa} (${imc.toFixed(1)})`);
      notified.current = faixa;
    }
  }, [imc]);

  return (
    <View style={{ width, height }}>
      {/* Aqui entra o velocímetro do IMC */}
    </View>
  );
};
