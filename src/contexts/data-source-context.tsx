"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// データソース型定義
type DataSource = 'firebase' | 'mock';

// コンテキストの型
interface DataSourceContextType {
    dataSource: DataSource;
    setDataSource: (source: DataSource) => void;
}

// デフォルト値の設定
const defaultContext: DataSourceContextType = {
    dataSource: 'firebase',
    setDataSource: () => { },
};

// コンテキスト作成
const DataSourceContext = createContext<DataSourceContextType>(defaultContext);

/**
 * データソースプロバイダーのProps型
 */
interface DataSourceProviderProps {
    children: ReactNode;
    initialDataSource?: DataSource;
}

/**
 * データソース設定を管理するプロバイダーコンポーネント
 */
export function DataSourceProvider({
    children,
    initialDataSource = 'firebase'
}: DataSourceProviderProps) {
    // データソースの状態管理
    const [dataSource, setDataSourceState] = useState<DataSource>(initialDataSource);

    // データソース変更時に localStorage に保存
    const setDataSource = (source: DataSource) => {
        try {
            localStorage.setItem('dataSource', source);
            setDataSourceState(source);
        } catch (error) {
            console.error('データソース設定の保存に失敗しました:', error);
        }
    };

    // マウント時に localStorage から設定を読み込む
    useEffect(() => {
        try {
            const savedDataSource = localStorage.getItem('dataSource') as DataSource | null;
            if (savedDataSource && (savedDataSource === 'firebase' || savedDataSource === 'mock')) {
                setDataSourceState(savedDataSource);
            }
        } catch (error) {
            console.error('データソース設定の読み込みに失敗しました:', error);
        }
    }, []);

    return (
        <DataSourceContext.Provider value={{ dataSource, setDataSource }}>
            {children}
        </DataSourceContext.Provider>
    );
}

/**
 * データソース設定を取得・更新するカスタムフック
 */
export function useDataSource() {
    const context = useContext(DataSourceContext);

    if (context === undefined) {
        throw new Error('useDataSource must be used within a DataSourceProvider');
    }

    return context;
}
