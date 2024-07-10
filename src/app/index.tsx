import { useState } from "react";
import { Image, Keyboard, Text, View } from "react-native";
import {
  MapPin,
  Calendar as IconCalendar,
  Settings2,
  UserRoundPlus,
  ArrowRight,
  AtSign,
} from "lucide-react-native";
import dayjs from "dayjs";
import { DateData } from "react-native-calendars";

import { colors } from "@/styles/colors";

import { Modal } from "@/components/modal";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { GuestEmail } from "@/components/email";
import { Calendar } from "@/components/calendar";

import { validateInput } from "@/utils/validateInput";
import { calendarUtils, DatesSelected } from "@/utils/calendarUtils";

enum StepForm {
  TRIP_DETAILS = 1,
  ADD_EMAIL = 2,
}

enum MODAL {
  NONE = 0,
  CALENDAR = 1,
  GUESTS = 2,
}

enum CUSTOM_MODAL {
  OPEN = 0,
  CLOSE = 1,
}

type CustomAlert = {
  title: string;
  message: string;
};

export default function Index() {
  /* DATA */
  const [stepForm, setStepForm] = useState(StepForm.TRIP_DETAILS);
  const [selectedDates, setSelectedDates] = useState({} as DatesSelected);
  const [destination, setDestination] = useState("");
  const [customAlert, setCustomAlert] = useState({
    title: "",
    message: "",
  } as CustomAlert);

  const [emailToInvite, setEmailToInvite] = useState<string>("");
  const [emailsToInvite, setEmailsToInvite] = useState<string[]>([]);

  /* MODAL */
  const [showModal, setShowModal] = useState(MODAL.NONE);
  const [showCustomModal, setShowCustomModal] = useState(CUSTOM_MODAL.CLOSE);

  function handleNextStepForm() {
    if (
      destination.trim().length === 0 ||
      !selectedDates.startsAt ||
      !selectedDates.endsAt
    ) {
      setShowCustomModal(CUSTOM_MODAL.OPEN);
      return setCustomAlert({
        title: "Detalhes da viagem",
        message: "Preencha todos os campos para seguir.",
      });
    }

    if (destination.trim().length < 4) {
      setShowCustomModal(CUSTOM_MODAL.OPEN);
      return setCustomAlert({
        title: "Detalhes da viagem",
        message: "O destino deve conter pelo menos 4 caracteres.",
      });
    }

    if (stepForm === StepForm.TRIP_DETAILS) {
      return setStepForm(StepForm.ADD_EMAIL);
    }
  }

  function handleDetailsStepForm() {
    if (stepForm === StepForm.ADD_EMAIL) {
      return setStepForm(StepForm.TRIP_DETAILS);
    }
  }

  function handleCloseModal() {
    setShowModal(MODAL.NONE);
  }

  function handleCloseCustomModal() {
    setShowCustomModal(CUSTOM_MODAL.CLOSE);
  }

  function handlePressCalendar() {
    if (stepForm === StepForm.TRIP_DETAILS) {
      setShowModal(MODAL.CALENDAR);
    }
  }

  function handleSelectedDates(selectedDay: DateData) {
    const dates = calendarUtils.orderStartsAtAndEndsAt({
      startsAt: selectedDates.startsAt,
      endsAt: selectedDates.endsAt,
      selectedDay,
    });
    setSelectedDates(dates);
  }

  function handleRemoveEmail(emailToRemove: string) {
    setEmailsToInvite((prevState) =>
      prevState.filter((email) => email !== emailToRemove)
    );
  }

  function handleAddEmail() {
    if (!validateInput.email(emailToInvite)) {
      setShowCustomModal(CUSTOM_MODAL.OPEN);
      return setCustomAlert({
        title: "Selecionar convidados",
        message: "E-mail inválido.",
      });
    }

    const emailAlreadyExists = emailsToInvite.find(
      (email) => email === emailToInvite
    );

    if (emailAlreadyExists) {
      setShowCustomModal(CUSTOM_MODAL.OPEN);
      setEmailToInvite("");
      return setCustomAlert({
        title: "Selecionar convidados",
        message: "E-mail já foi selecionado.",
      });
    }

    setEmailsToInvite((prevState) => [...prevState, emailToInvite]);
    setEmailToInvite("");
  }

  function handleGuests() {
    Keyboard.dismiss();
    setShowModal(MODAL.GUESTS);
  }

  async function saveTrip(tripId: string) {
    try {
    } catch (error) {
      throw error;
    }
  }

  return (
    <View className="flex-1 items-center justify-center px-5">
      <Image
        source={require("@/assets/logo.png")}
        className="h-8"
        resizeMode="contain"
      />
      <Image source={require("@/assets/bg.png")} className="absolute" />

      <Text className=" text-zinc-400 font-regular text-center text-lg mt-3">
        Convide seus amigos e planeje sua{"\n"}próxima viagem
      </Text>
      <View className="w-ful  bg-zinc-900 p-4 rounded-xl my-8 mx-6 border-zinc-800">
        <Input>
          <MapPin color={colors.zinc[400]} size={20} />
          <Input.Field
            placeholder="Para onde?"
            editable={stepForm === StepForm.TRIP_DETAILS}
            value={destination}
            onChangeText={setDestination}
          />
        </Input>
        <Input>
          <IconCalendar color={colors.zinc[400]} size={20} />
          <Input.Field
            placeholder="Quando?"
            value={selectedDates.formatDatesInText}
            editable={stepForm === StepForm.TRIP_DETAILS}
            onFocus={() => Keyboard.dismiss()}
            showSoftInputOnFocus={false}
            onPressIn={handlePressCalendar}
          />
        </Input>

        {stepForm === StepForm.ADD_EMAIL && (
          <>
            <View className="border-b py-3 border-zinc-800">
              <Button variant="secondary" onPress={handleDetailsStepForm}>
                <Button.Title>Alterar local/data</Button.Title>
                <Settings2 color={colors.zinc[200]} size={20} />
              </Button>
            </View>
            <Input>
              <UserRoundPlus color={colors.zinc[400]} size={20} />
              <Input.Field
                placeholder="Quem estará na viagem?"
                autoCorrect={false}
                value={
                  emailsToInvite.length > 0
                    ? `${emailsToInvite.length} pessoas(a) convidadas(s)`
                    : ""
                }
                onPress={handleGuests}
                showSoftInputOnFocus={false}
              />
            </Input>
          </>
        )}
        <Button onPress={handleNextStepForm}>
          <Button.Title>
            {stepForm === StepForm.TRIP_DETAILS
              ? "Continuar"
              : "Confirmar Viagem"}
          </Button.Title>
          <ArrowRight color={colors.lime[950]} size={20} />
        </Button>
      </View>
      <Text className="text-zinc-500 font-regular text-center text-base">
        Ao planejar sua viagem pela plann.er você automaticamente concorda com
        nossos{" "}
        <Text className="text-zinc-300 underline">
          termos de uso e políticas de privacidade.
        </Text>
      </Text>

      <Modal
        title="Selecionar datas"
        subtitle="Selecione a data de ida e volta da viagem"
        visible={showModal === MODAL.CALENDAR}
        onClose={handleCloseModal}
      >
        <View className="gap-4 mt-4">
          <Calendar
            minDate={dayjs().toISOString()}
            onDayPress={handleSelectedDates}
            markedDates={selectedDates.dates}
          />
          <Button onPress={handleCloseModal}>
            <Button.Title>Confirmar</Button.Title>
          </Button>
        </View>
      </Modal>

      <Modal
        title={customAlert.title}
        subtitle={customAlert.message}
        visible={showCustomModal === CUSTOM_MODAL.OPEN}
        onClose={handleCloseCustomModal}
      />

      <Modal
        title="Selecionar convidados"
        subtitle="Os convidados irão receber e-mails para confirmar a participação na viagem."
        visible={showModal === MODAL.GUESTS}
        onClose={handleCloseModal}
      >
        <View className="my-2 flex-wrap gap-2 border-b border-zinc-800 py-5 items-start">
          {emailsToInvite.length > 0 ? (
            emailsToInvite.map((email, index) => (
              <GuestEmail
                email={email}
                onRemove={() => handleRemoveEmail(email)}
                key={email}
              />
            ))
          ) : (
            <Text className="text-zinc-600 text-base font-regular">
              Nenhum e-mail adicionado
            </Text>
          )}
        </View>

        <View className="gap-4 mt-4">
          <Input variant="secondary">
            <AtSign color={colors.zinc[400]} size={20} />
            <Input.Field
              placeholder="Digite o e-mail do convidado"
              keyboardType="email-address"
              onChangeText={(text) => setEmailToInvite(text.toLowerCase())}
              value={emailToInvite}
              returnKeyType="send"
              onSubmitEditing={handleAddEmail}
            />
          </Input>
          <Button onPress={handleAddEmail}>
            <Button.Title>Convidar</Button.Title>
          </Button>
        </View>
      </Modal>
    </View>
  );
}
