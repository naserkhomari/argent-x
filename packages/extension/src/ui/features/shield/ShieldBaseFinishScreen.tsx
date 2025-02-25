import { Button, CellStack, P3, P4, icons } from "@argent/ui"
import { Center } from "@chakra-ui/react"
import { FC } from "react"
import { Link, To } from "react-router-dom"

import { ShieldHeader, ShieldHeaderProps } from "./ui/ShieldHeader"
import {
  ChangeGuardian,
  LiveAccountGuardianState,
} from "./usePendingChangingGuardian"

const SHARE_FEEDBACK_URL = "https://discord.gg/T4PDFHxm6T"

const {
  ArgentShieldIcon,
  ArgentShieldDeactivateIcon,
  TickIcon,
  AnnouncementIcon,
  AlertIcon,
} = icons

export interface GetShieldHeaderProps {
  accountName?: string
  liveAccountGuardianState?: LiveAccountGuardianState
}

const getShieldHeaderProps = ({
  liveAccountGuardianState,
  accountName,
}: GetShieldHeaderProps): ShieldHeaderProps => {
  if (!liveAccountGuardianState) {
    return {
      title: "Argent Shield",
    }
  }
  const { status, type } = liveAccountGuardianState
  const isAdding = type === ChangeGuardian.ADDING
  if (status === "ERROR") {
    return {
      icon: AlertIcon,
      title: isAdding
        ? "Adding Argent Shield Failed"
        : "Removing Argent Shield Failed",
      subtitle: `${accountName} was not modified because the transaction failed. Please try again later`,
      variant: "danger",
    }
  }
  if (status === "PENDING") {
    return {
      icon: isAdding ? ArgentShieldIcon : ArgentShieldDeactivateIcon,
      title: isAdding ? "Adding Argent Shield…" : "Removing Argent Shield…",
      subtitle: isAdding ? (
        <>
          Argent Shield is being added to {accountName}. A{" "}
          <ArgentShieldIcon
            display={"inline"}
            position={"relative"}
            top={"0.125em"}
          />{" "}
          icon will appear next to your account name once it’s added
        </>
      ) : (
        <>
          Argent Shield is being removed from {accountName}. This can take a few
          minutes
        </>
      ),
      isLoading: true,
    }
  }
  if (status === "SUCCESS") {
    return {
      icon: isAdding ? TickIcon : ArgentShieldDeactivateIcon,
      title: isAdding ? "Argent Shield Added" : "Argent Shield Removed",
      subtitle: isAdding
        ? `${accountName} is now protected by Argent Shield two-factor authentication`
        : `${accountName} is not protected by Argent Shield two-factor authentication`,
      variant: isAdding ? "success" : "removed",
    }
  }
  /** 'UNKNOWN' - no transaction */
  return {
    title: "Argent Shield",
  }
}

export interface ShieldBaseFinishScreenProps {
  accountName?: string
  liveAccountGuardianState?: LiveAccountGuardianState
  returnRoute: To
}

export const ShieldBaseFinishScreen: FC<ShieldBaseFinishScreenProps> = ({
  accountName,
  liveAccountGuardianState,
  returnRoute,
}) => {
  const headerProps = getShieldHeaderProps({
    accountName,
    liveAccountGuardianState,
  })

  return (
    <CellStack flex={1}>
      <Center flex={1} flexDirection={"column"}>
        <ShieldHeader size={"lg"} {...headerProps} />
        <Center
          bg={"accent.800"}
          rounded={"xl"}
          flexDirection={"column"}
          px={3}
          py={4}
          textAlign={"center"}
        >
          <P3 mb={2} fontWeight={"semibold"}>
            <AnnouncementIcon
              display={"inline-block"}
              fontSize={"xl"}
              verticalAlign={"bottom"}
              transform={"scaleX(-1)"}
              mr={1}
            />{" "}
            We want to hear your feedback
          </P3>
          <P4 mb={4}>
            Thanks for being an early tester of Argent Shield. Let us know your
            thoughts on Discord
          </P4>
          <Button
            as={"a"}
            href={SHARE_FEEDBACK_URL}
            target="_blank"
            colorScheme={"accent"}
            size={"xs"}
            w={"100%"}
          >
            Share feedback
          </Button>
        </Center>
      </Center>
      <Button as={Link} to={returnRoute} colorScheme={"primary"}>
        {headerProps.isLoading ? "Dismiss" : "Done"}
      </Button>
    </CellStack>
  )
}
