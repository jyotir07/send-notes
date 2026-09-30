import { Component, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from './Button';
import { EmptyState } from './EmptyState';

type Props = { children: ReactNode; background: string };
type State = { error: Error | null; attempt: number };

/** Catches failures above the router (e.g. the database failing to open or migrate). */
export class AppErrorBoundary extends Component<Props, State> {
  state: State = { error: null, attempt: 0 };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error('App failed to start', error);
  }

  render() {
    const { error, attempt } = this.state;
    if (!error) {
      // Changing the key remounts the subtree, which retries opening the database.
      return <View key={attempt} style={styles.flex}>{this.props.children}</View>;
    }

    return (
      <View style={[styles.flex, styles.center, { backgroundColor: this.props.background }]}>
        <EmptyState
          title="TakeNote couldn't start"
          message={`Your lists are stored on this phone and haven't been deleted. ${error.message}`}
          action={
            <Button
              label="Try again"
              onPress={() => this.setState({ error: null, attempt: attempt + 1 })}
            />
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
  },
});
