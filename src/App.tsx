import { useState } from "react";
import MuiCard from "@mui/material/Card";
import {
  Box,
  Button,
  Checkbox,
  CssBaseline,
  FormControl,
  FormControlLabel,
  FormLabel,
  TextField,
  Typography,
  Alert,
  Stack,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AppTheme from "./shared-theme/AppTheme";
import ColorModeSelect from "./shared-theme/ColorModeSelect";
import {
  GoogleIcon,
  FacebookIcon,
  SitemarkIcon,
} from "./components/CustomIcons";
import { useUserActions } from "./hooks/useractions";
import { type LoginInput } from "./helpers/interfaces";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

export default function App(props: { disableCustomTheme?: boolean }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [usernameErrorMsg, setUsernameErrorMsg] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMsg, setPasswordErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [open, setOpen] = useState(false);
  const userActions = useUserActions();
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  //const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateInputs()) {
      return; // Stop submission if validation fails
    }
    setIsLoading(true);
    setApiError("");
    //await sleep(1000);
    const loginData: LoginInput = {
      username: username,
      password: password,
    };
    try {
      await userActions.login(loginData);
    } catch (err: any) {
      if (err.request?.response) {
        try {
          const errorObject = JSON.parse(err.request.response);
          setApiError(errorObject.detail || "An unknown error occurred.");
        } catch (e) {
          setApiError(err.request.response);
        }
      } else {
        setApiError("A network error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const validateInputs = () => {
    let isValid = true;
    setApiError("");

    if (!username || username.length < 6) {
      setUsernameError(true);
      setUsernameErrorMsg("Username must be at least 6 characters long.");
      isValid = false;
    } else {
      // Clear username error if valid
      setUsernameError(false);
      setUsernameErrorMsg("");
    }
    if (!password || password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMsg("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMsg("");
    }
    return isValid;
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <ColorModeSelect
          sx={{ position: "fixed", top: "1rem", right: "1rem" }}
        />
        <Card variant="outlined">
          <SitemarkIcon />
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
          >
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="username">Username</FormLabel>
              <TextField
                error={usernameError}
                helperText={usernameErrorMsg}
                id="username"
                type="text"
                name="username"
                placeholder="your username"
                autoComplete="username"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={usernameError ? "error" : "primary"}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                error={passwordError}
                helperText={passwordErrorMsg}
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={passwordError ? "error" : "primary"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            {apiError && <Alert severity="error">{apiError}</Alert>}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress
                  size={38}
                  sx={{
                    color: "#ac1234",
                    position: "absolute",
                  }}
                />
              ) : (
                "Sign in"
              )}
            </Button>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}></Box>
        </Card>
      </SignInContainer>
    </AppTheme>
  );
}
